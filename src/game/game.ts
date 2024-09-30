import {
  TGameState,
  TEngine,
  TResourcePack,
  TOrthographicCamera,
  TFixedAxisCameraController,
} from "@tedengine/ted";
import Level from "./level";
import Player from "./player";
import config from "./config";
import { vec3 } from "gl-matrix";

class GameState extends TGameState {
  public async onCreate(engine: TEngine) {
    const rp = new TResourcePack(engine, Level.resources, Player.resources);
    await rp.load();

    this.onReady(engine);
  }

  public beforeWorldCreate() {
    // Disable gravity
    this.world!.config.mode = "2d";
    this.world!.config.collisionClasses.push({
      name: "Player",
    });
    this.world!.config.collisionClasses.push({
      name: "Boundary",
    });

    this.world!.config.gravity = vec3.fromValues(0, -100, 0);
  }

  public onUpdate() {}
  public onReady(engine: TEngine) {
    const camera = new TOrthographicCamera(engine);
    this.activeCamera = camera;
    this.addActor(camera);

    const level = new Level(engine, this);
    this.addActor(level);

    const player = new Player(engine, this, 50, 400);
    this.addActor(player);

    const cameraController = new TFixedAxisCameraController({
      distance: 20,
      axis: "z",
      bounds: {
        min: vec3.fromValues(0, 300, 0),
        max: vec3.fromValues(config.levelWidth, config.levelHeight, 0),
      },
      // leadFactor: 0.5,
      maxLead: 150,
      lerpFactor: 0.9,
    });
    cameraController.attachTo(player.rootComponent);
    camera.controller = cameraController;
  }
}

const gameConfig = {
  states: {
    game: GameState,
  },
  defaultState: "game",
};

new TEngine(gameConfig, self);
