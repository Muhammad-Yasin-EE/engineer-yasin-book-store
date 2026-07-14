const gis = require('google-image-sr').default;

async function test() {
  try {
    const results = await gis('Adobe Photoshop official icon transparent png');
    console.log("Found Results for Photoshop:", results.slice(0, 2));
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
