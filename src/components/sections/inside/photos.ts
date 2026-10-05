import { gallery, lookInside } from "@/content/site";

/**
 * Gallery photos for the section's thumbnail row, by gallery index. The one
 * the section already shows large is left out, so no photo appears twice in
 * the same view; the gallery itself still holds all of them.
 */
export const thumbIndexes = gallery.photos.flatMap((photo, i) => (photo.src === lookInside.image.src ? [] : [i]));
