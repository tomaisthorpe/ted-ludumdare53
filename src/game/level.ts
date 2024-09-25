import {
  TActor,
  TBoxCollider,
  TEngine,
  TGameState,
  TOriginPoint,
  TResourcePackConfig,
  TSceneComponent,
  TSpriteComponent,
  TSpriteLayer,
  TTextureFilter,
} from "@tedengine/ted";
import config from "./config";
import levelTexture from "../assets/level.png";
import { vec3 } from "gl-matrix";

class Wall extends TActor {
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    collisionClass: string
  ) {
    super();

    const box = new TSceneComponent(this, {
      mass: 0,
      fixedRotation: true,
    });
    box.transform.translation = vec3.fromValues(
      x + width / 2,
      y - height / 2,
      -20
    );
    this.rootComponent = box;

    box.collider = new TBoxCollider(width, height, 30, collisionClass);
  }
}

export default class Level extends TActor {
  public static resources: TResourcePackConfig = {
    textures: [
      {
        url: levelTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
    ],
  };

  constructor(engine: TEngine, state: TGameState) {
    super();

    const sprite = new TSpriteComponent(
      engine,
      this,
      config.levelWidth,
      config.levelHeight,
      TOriginPoint.BottomLeft
    );
    sprite.layer = TSpriteLayer.Background_0;
    sprite.applyTexture(engine, levelTexture);

    this.rootComponent.transform.translation = vec3.fromValues(0, 0, -100);

    state.addActor(
      new Wall(-150, 900 - 19, config.levelWidth + 300, 19, "Solid")
    );
    state.addActor(new Wall(0, 0, config.levelWidth, 18, "Boundary"));
    state.addActor(new Wall(0, 0, 20, config.levelHeight, "Boundary"));
    state.addActor(
      new Wall(config.levelWidth - 20, 0, 20, config.levelHeight, "Boundary")
    );
  }
}
