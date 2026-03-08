// Plugin to fill frames with AI-generated faces from thispersondoesnotexist.com

figma.showUI(__html__, { width: 300, height: 160, themeColors: true });

function updateSelectionCount() {
  const selection = figma.currentPage.selection;
  const validNodes = selection.filter(
    (node) =>
      node.type === "FRAME" ||
      node.type === "RECTANGLE" ||
      node.type === "ELLIPSE" ||
      node.type === "COMPONENT" ||
      node.type === "INSTANCE"
  );
  figma.ui.postMessage({ type: 'selection-count', count: validNodes.length });
}

figma.on('selectionchange', () => {
  updateSelectionCount();
});

// Initial count
updateSelectionCount();

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'insert-images') {
    const selection = figma.currentPage.selection;
    const validNodes = selection.filter(
      (node) =>
        node.type === "FRAME" ||
        node.type === "RECTANGLE" ||
        node.type === "ELLIPSE" ||
        node.type === "COMPONENT" ||
        node.type === "INSTANCE"
    );

    if (validNodes.length === 0) {
      figma.notify("⚠️ Please select at least one frame or shape");
      return;
    }

    figma.notify(`🔄 Loading ${validNodes.length} image(s)...`);

    try {
      let successCount = 0;

      for (let i = 0; i < validNodes.length; i++) {
        try {
          const node = validNodes[i];

          // Use thispersondoesnotexist.com for AI-generated faces
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

      figma.notify(`✅ ${successCount} image(s) successfully added!`);
    } catch (error) {
      figma.notify(`❌ Error: ${error.message}`);
      console.error(error);
    }
  }
};