import Product from "../models/Product.js";

const DEFAULT_MODEL = "gpt-5.6-luna";

const getOutputText = (response) => {
  if (typeof response?.output_text === "string" && response.output_text.trim()) {
    return response.output_text;
  }

  for (const item of response?.output || []) {
    if (item?.type !== "message") continue;

    for (const content of item.content || []) {
      if (content?.type === "output_text" && content.text) return content.text;
    }
  }

  return "";
};

const buildRecommendationReason = (message, product) => {
  const query = message.toLowerCase();
  const category = product.category || "product";
  const features = (product.features || []).filter(Boolean).slice(0, 2);
  const featureText = features.join(" and ");
  const priceText = `${product.currency || "USD"} ${Number(product.price || 0).toLocaleString()}`;

  if (/(coding|programming|developer|development|software)/.test(query)) {
    if (featureText) return `A strong coding option with ${featureText}.`;
    return `A solid ${category.toLowerCase()} option for development work.`;
  }

  if (/(gaming|gamer)/.test(query)) {
    if (featureText) return `A gaming-focused option featuring ${featureText}.`;
    return `A good ${category.toLowerCase()} match for a gaming setup.`;
  }

  if (/(music|audio|headphone|headset)/.test(query)) {
    if (featureText) return `A good audio match with ${featureText}.`;
    return `A suitable ${category.toLowerCase()} choice for your audio needs.`;
  }

  if (/(camera|photography|photo|video)/.test(query)) {
    if (featureText) return `A useful choice for photo and video use, with ${featureText}.`;
    return `A suitable ${category.toLowerCase()} option for photo and video use.`;
  }

  if (/(budget|under|below|less than|around|cheap|affordable)/.test(query)) {
    return `A ${category.toLowerCase()} option priced at ${priceText} that fits the requested budget focus.`;
  }

  if (featureText) return `Matches your request with ${featureText}.`;
  return `A relevant in-stock ${category.toLowerCase()} option that matches your request.`;
};

const getFallbackRecommendations = (message, products) => {
  const query = message.toLowerCase();
  const terms = query.split(/[^a-z0-9]+/).filter((term) => term.length > 2);

  return products
    .map((product) => {
      const haystack = [
        product.name,
        product.description,
        product.category,
        product.brand,
        ...(product.features || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      let score = Number(product.bestseller) * 2 + Number(product.featured) + Number(product.newArrival);
      for (const term of terms) {
        if (haystack.includes(term)) score += 3;
      }

      const category = product.category?.toLowerCase() || "";
      if (query.includes("laptop") && category === "laptops") score += 8;
      if (query.includes("phone") && category === "smartphones") score += 8;
      if ((query.includes("headphone") || query.includes("audio")) && category === "audio") score += 6;
      if (query.includes("watch") && category === "wearables") score += 6;
      if (query.includes("tablet") && category === "tablets") score += 6;

      return { product, score };
    })
    .sort((a, b) => b.score - a.score || (b.product.rating || 0) - (a.product.rating || 0))
    .slice(0, 3)
    .map(({ product }) => ({
      productId: String(product._id),
      name: product.name,
      price: product.price,
      currency: product.currency,
      category: product.category,
      image: product.image || product.images?.[0] || "",
      rating: product.rating,
      reason: buildRecommendationReason(message, product),
    }));
};

const buildFallbackResponse = (message, products) => ({
  success: true,
  message: "Based on your request, here are the best matches from our in-stock catalog.",
  recommendations: getFallbackRecommendations(message, products),
  fallback: true,
});

export const aiShoppingAssistant = async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({ success: false, message: "Please tell me what you are looking for." });
    }

    if (message.length > 1200) {
      return res.status(400).json({ success: false, message: "Please keep your request under 1,200 characters." });
    }

    const products = await Product.find({ isActive: true, stock: { $gt: 0 } })
      .select("name description price currency category brand features rating bestseller newArrival featured image images")
      .sort({ bestseller: -1, featured: -1, rating: -1 })
      .limit(60)
      .lean();

    if (!products.length) {
      return res.status(200).json({
        success: true,
        message: "I don't have any in-stock products to recommend right now.",
        recommendations: [],
      });
    }

    const fallback = () => res.status(200).json(buildFallbackResponse(message, products));

    if (!process.env.OPENAI_API_KEY) {
      console.error("AI Shopping Assistant configuration error: OPENAI_API_KEY is missing. Using catalog fallback.");
      return fallback();
    }

    const catalog = products.map((product) => ({
      id: String(product._id),
      name: product.name,
      description: product.description,
      price: product.price,
      currency: product.currency,
      category: product.category,
      brand: product.brand,
      features: product.features || [],
      rating: product.rating,
      bestseller: Boolean(product.bestseller),
      newArrival: Boolean(product.newArrival),
    }));

    const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
    let openAIResponse;

    try {
      openAIResponse = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          instructions:
            "You are TechStore Pro's shopping assistant. Recommend only products from the supplied in-stock catalog. Never invent products, prices, features, stock, discounts, or URLs. Return valid JSON only with this shape: {\"message\":\"string\",\"recommendations\":[{\"productId\":\"catalog id\",\"reason\":\"short specific reason\"}]}. Return no more than 3 recommendations. Each reason must explain why that exact product fits the customer's request using only facts present in the catalog; mention relevant features, use case, category, or budget when supported. Never use generic reasons such as 'relevant option' or 'based on your request'. If the request is vague, ask one concise clarifying question and return an empty recommendations array.",
          input: `Customer request:\n${message}\n\nIn-stock product catalog:\n${JSON.stringify(catalog)}`,
          max_output_tokens: 500,
        }),
      });
    } catch (error) {
      console.error("OpenAI request failed before receiving a response:", {
        name: error?.name,
        message: error?.message,
        model,
      });
      return fallback();
    }

    if (!openAIResponse.ok) {
      const requestId = openAIResponse.headers.get("x-request-id") || "not-provided";
      const errorBody = await openAIResponse.text();
      let parsedError = null;

      try {
        parsedError = JSON.parse(errorBody)?.error || null;
      } catch {
        // Keep diagnostics safe if the provider returns non-JSON text.
      }

      console.error("OpenAI API error; using catalog fallback:", {
        status: openAIResponse.status,
        statusText: openAIResponse.statusText,
        requestId,
        model,
        type: parsedError?.type || "unknown",
        code: parsedError?.code || "unknown",
        param: parsedError?.param || null,
        message: parsedError?.message || "non-json response",
      });

      return fallback();
    }

    let data;
    try {
      data = await openAIResponse.json();
    } catch (error) {
      console.error("OpenAI returned an unreadable response; using catalog fallback:", error?.message);
      return fallback();
    }

    const outputText = getOutputText(data);
    if (!outputText) {
      console.error("OpenAI returned no assistant output; using catalog fallback.");
      return fallback();
    }

    let parsed;
    try {
      parsed = JSON.parse(outputText);
    } catch (error) {
      console.error("OpenAI returned invalid JSON output; using catalog fallback:", error?.message);
      return fallback();
    }

    const productMap = new Map(products.map((product) => [String(product._id), product]));
    const recommendations = (Array.isArray(parsed.recommendations) ? parsed.recommendations : [])
      .filter((item) => productMap.has(String(item.productId)))
      .slice(0, 3)
      .map((item) => {
        const product = productMap.get(String(item.productId));
        const reason = String(item.reason || "").trim();
        return {
          productId: String(product._id),
          name: product.name,
          price: product.price,
          currency: product.currency,
          category: product.category,
          image: product.image || product.images?.[0] || "",
          rating: product.rating,
          reason: reason || buildRecommendationReason(message, product),
        };
      });

    return res.status(200).json({
      success: true,
      message: String(parsed.message || "Here are a few products that may fit your needs."),
      recommendations,
    });
  } catch (error) {
    console.error("AI Shopping Assistant Error:", error);

    try {
      const message = String(req.body?.message || "").trim();
      const products = await Product.find({ isActive: true, stock: { $gt: 0 } })
        .select("name description price currency category brand features rating bestseller newArrival featured image images")
        .sort({ bestseller: -1, featured: -1, rating: -1 })
        .limit(60)
        .lean();

      if (products.length) return res.status(200).json(buildFallbackResponse(message, products));
    } catch (fallbackError) {
      console.error("AI Shopping Assistant fallback failed:", fallbackError);
    }

    return res.status(500).json({
      success: false,
      message: "I couldn't complete that recommendation right now. Please try again.",
    });
  }
};
