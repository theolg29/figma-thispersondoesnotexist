// Plugin to fill frames with AI-generated faces from thispersondoesnotexist.com

async function fillFramesWithRandomFaces() {
  const selection = figma.currentPage.selection;

  // Check if there are selected elements
  if (selection.length === 0) {
    figma.notify("⚠️ Please select at least one frame");
    figma.closePlugin();
    return;
  }

  // Filter to keep only valid elements
  const validNodes = selection.filter(
    (node) =>
      node.type === "FRAME" ||
      node.type === "RECTANGLE" ||
      node.type === "ELLIPSE" ||
      node.type === "COMPONENT" ||
      node.type === "INSTANCE"
  );

  if (validNodes.length === 0) {
    figma.notify("⚠️ Please select frames or shapes");
    figma.closePlugin();
    return;
  }

  figma.notify(`🔄 Loading ${validNodes.length} image(s)...`);

  try {
    let successCount = 0;

    for (let i = 0; i < validNodes.length; i++) {
      try {
        const node = validNodes[i];

        // Use thispersondoesnotexist.com for AI-generated faces
        // Each request automatically generates a new image
        const imageUrl = "https://thispersondoesnotexist.com/";

        // Use createImageAsync which bypasses CORS!
        const image = await figma.createImageAsync(imageUrl);

        // Apply the image as fill
        node.fills = [
          {
            type: "IMAGE",
            imageHash: image.hash,
            scaleMode: "FILL",
          },
        ];

        successCount++;

        // Delay between requests for thispersondoesnotexist
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error loading image ${i}:`, error);
      }
    }

    figma.notify(`✅ ${successCount} image(s) added successfully!`);
  } catch (error) {
    figma.notify(`❌ Error: ${error.message}`);
    console.error(error);
  }

  figma.closePlugin();
}

// Run the function
fillFramesWithRandomFaces();
