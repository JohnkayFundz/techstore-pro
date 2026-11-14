import test from "node:test";
import assert from "node:assert/strict";
import { Writable } from "node:stream";

import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

test("uploads a buffer with the supplied Cloudinary options", async () => {
  const input = Buffer.from("test-image-bytes");
  const expected = {
    secure_url: "https://res.cloudinary.com/demo/image/upload/test.png",
    public_id: "techstore-products/test",
    bytes: input.length,
  };
  let received = Buffer.alloc(0);
  let receivedOptions;

  const uploader = {
    upload_stream(options, callback) {
      receivedOptions = options;
      return new Writable({
        write(chunk, _encoding, done) {
          received = Buffer.concat([received, chunk]);
          done();
        },
        final(done) {
          callback(null, expected);
          done();
        },
      });
    },
  };

  const result = await uploadBufferToCloudinary(uploader, input, {
    folder: "techstore-products",
    resource_type: "image",
  });

  assert.deepEqual(received, input);
  assert.deepEqual(receivedOptions, {
    folder: "techstore-products",
    resource_type: "image",
  });
  assert.deepEqual(result, expected);
});

test("rejects when Cloudinary reports an upload error", async () => {
  const expectedError = new Error("upload rejected");
  const uploader = {
    upload_stream(_options, callback) {
      return new Writable({
        write(_chunk, _encoding, done) {
          done();
        },
        final(done) {
          callback(expectedError);
          done();
        },
      });
    },
  };

  await assert.rejects(
    uploadBufferToCloudinary(uploader, Buffer.from("data"), {}),
    expectedError
  );
});

test("rejects incomplete Cloudinary results", async () => {
  const uploader = {
    upload_stream(_options, callback) {
      return new Writable({
        write(_chunk, _encoding, done) {
          done();
        },
        final(done) {
          callback(null, { public_id: "missing-url" });
          done();
        },
      });
    },
  };

  await assert.rejects(
    uploadBufferToCloudinary(uploader, Buffer.from("data"), {}),
    /incomplete upload result/
  );
});

test("rejects invalid input before opening an upload stream", async () => {
  let opened = false;
  const uploader = {
    upload_stream() {
      opened = true;
      throw new Error("must not open");
    },
  };

  await assert.rejects(
    uploadBufferToCloudinary(uploader, "not-a-buffer", {}),
    /requires a Buffer/
  );
  assert.equal(opened, false);
});
