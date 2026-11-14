/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// 2026-10-22 benchmark (V1-C01, 120 frames): swangle 136 s, angle 19 s, vulkan 19 s on the RX 9070 XT -> GPU compositing by default.
Config.setChromiumOpenGlRenderer("angle");

// 2026-11-03: heavy 3-D intro frames (many video planes + motion blur) can exceed 30 s on a busy machine
Config.setDelayRenderTimeoutInMilliseconds(180000);
