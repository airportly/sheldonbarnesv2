import { Config } from "@remotion/cli/config";

// Deterministic, high-quality MP4 output for the HUD aesthetic.
Config.setVideoImageFormat("png");
Config.setConcurrency(null); // let Remotion pick based on the machine
Config.setChromiumOpenGlRenderer("angle"); // reliable canvas/WebGL on the globe layer
Config.setCodec("h264");
Config.setCrf(16); // near-lossless; the thin white linework needs it
Config.setPixelFormat("yuv420p"); // broad player compatibility
Config.setOverwriteOutput(true);
