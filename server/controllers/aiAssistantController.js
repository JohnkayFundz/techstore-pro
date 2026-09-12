import Product from "../models/Product.js";

const DEFAULT_MODEL = "gpt-5.6-luna";

const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    message: { type: "string" },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          productId: { type: "string" },
          reason: { type: "string" },
        },
        required: ["productId", "reason"],
      },
    },
  },
  required: ["message", "recommendations"],
};

const getOutputText = (response) => {
  for (const item of response?.output || []) {
    if (item?.type !== "message") continue;

    for (const content of item.content || []) {
      if (content?.type === "output_text" && content.text) {
        return content.text;
      }
    }
  }

  return "";
};

export const aiShoppingAssistant = async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Please tell me what you are looking for.",
      });
    }

    if (message.length > 1200) {
      return res.status(400).json({
        success: false,
        message: "Please keep your request under 1,200 characters.",
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("AI Shopping Assistant configuration error: OPENAI_API_KEY is missing.");
      return res.status(503).json({
        success: false,
        message: "The AI shopping assistant is being configured. Please try again shortly.",
        diagnostic: {
          source: "server-config",
          reason: "missing_api_key",
        },
      });
    }

    const products = await Product.find({ isActive: true, stock: { $gt: 0 } })
      .select("name description price currency category brand features rating bestseller newArrival image")
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
            "You are TechStore Pro's shopping assistant. Help customers choose from the supplied in-stock catalog. Never invent products, prices, features, stock, discounts, or URLs. Recommend only products whose exact id appears in the catalog. If the request is vague, ask one concise clarifying question instead of guessing. Keep the tone friendly, practical, and concise. Mention budget or use-case fit when relevant. Return no more than 3 recommendations.",
          input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: `Customer request:\n${message}\n\nIn-stock product catalog:\n${JSON.stringify(catalog)}`,
                },
              ],
            },
          ],
          text: {
            format: {
              type: "json_schema",
              name: "shopping_assistant_response",
              strict: true,
              schema: responseSchema,
            },
          },
          max_output_tokens: 500,
        }),
      });
    } catch (error) {
      console.error("OpenAI request failed before receiving a response:", {
        name: error?.name,
        message: error?.message,
        model,
      });

      return res.status(502).json({
        success: false,
        message: "The shopping assistant is temporarily unavailable. Please try again.",
        diagnostic: {
          source: "openai-network",
          reason: error?.name || "request_failed",
        },
      });
    }

    if (!openAIResponse.ok) {
      const requestId = openAIResponse.headers.get("x-request-id") || "not-provided";
      const errorBody = await openAIResponse.text();

      let parsedError = null;
      try {
        parsedError = JSON.parse(errorBody)?.error || null;
      } catch {
        // OpenAI normally returns JSON, but keep diagnostics safe if it does not.
      }

      const diagnostic = {
        source: "openai-api",
        status: openAIResponse.status,
        requestId,
        type: parsedError?.type || "unknown",
        code: parsedError?.code || "unknown",
        param: parsedError?.param || null,
      };

      console.error("OpenAI API error:", {
        ...diagnostic,
        model,
        message: parsedError?.message || "non-json response",
      });

      return res.status(502).json({
        success: false,
        message: "The shopping assistant is temporarily unavailable. Please try again.",
        diagnostic,
      });
    }

    const data = await openAIResponse.json();
    const outputText = getOutputText(data);

    if (!outputText) {
      throw new Error("OpenAI returned no assistant output.");
    }

    const parsed = JSON.parse(outputText);
    const productMap = new Map(products.map((product) => [String(product._id), product]));

    const recommendations = (parsed.recommendations || [])
      .filter((item) => productMap.has(String(item.productId)))
      .slice(0, 3)
      .map((item) => {
        const product = productMap.get(String(item.productId));

        return {
          productId: String(product._id),
          name: product.name,
          price: product.price,
          currency: product.currency,
          category: product.category,
          image: product.image || product.images?.[0] || "",
          rating: product.rating,
          reason: item.reason,
        };
      });

    return res.status(200).json({
      success: true,
      message: parsed.message || "Here are a few products that may fit your needs.",
      recommendations,
    });
  } catch (error) {
    console.error("AI Shopping Assistant Error:", error);

    return res.status(500).json({
      success: false,
      message: "I couldn't complete that recommendation right now. Please try again.",
    });
  }
};
