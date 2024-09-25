import {
  TAnimatedSpriteComponent,
  TEngine,
  TOriginPoint,
  TPawn,
  TResourcePackConfig,
  TSceneComponent,
  TSphereCollider,
  TSpriteLayer,
} from "@tedengine/ted";
import playerTexture from "../assets/pigeon.png";
import { vec3 } from "gl-matrix";

export default class Player extends TPawn {
  public static resources: TResourcePackConfig = {
    textures: [playerTexture],
  };

  constructor(engine: TEngine, x: number, y: number) {
    super();

    this.rootComponent = new TSceneComponent(this, {
      mass: 1,
      fixedRotation: true,
    });
    this.rootComponent.collider = new TSphereCollider(16, "Player");
    this.rootComponent.transform.translation = vec3.fromValues(x, y, -10);

    const sprite = new TAnimatedSpriteComponent(
      engine,
      this,
      16,
      16,
      TOriginPoint.Center,
      TSpriteLayer.Foreground_0,
      {
        frameCount: 12,
        frameRate: 12,
      }
    );
    sprite.applyTexture(engine, playerTexture);
  }
}
