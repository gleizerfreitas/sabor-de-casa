import { describe, expect, it, vi } from "vitest";
import { removeUploadedPhoto } from "@/src/server/services/catalog-service";

describe("removeUploadedPhoto", () => {
  it("removes exactly the newly uploaded path", async () => {
    const remove = vi.fn().mockResolvedValue({ error: null });
    const supabase = { storage: { from: vi.fn().mockReturnValue({ remove }) } };

    await removeUploadedPhoto(supabase as never, "dish-photo.webp");

    expect(supabase.storage.from).toHaveBeenCalledWith("dish-photos");
    expect(remove).toHaveBeenCalledWith(["dish-photo.webp"]);
  });

  it("propagates cleanup failures", async () => {
    const error = new Error("storage unavailable");
    const supabase = {
      storage: { from: vi.fn().mockReturnValue({ remove: vi.fn().mockResolvedValue({ error }) }) },
    };

    await expect(removeUploadedPhoto(supabase as never, "dish-photo.webp")).rejects.toBe(error);
  });
});
