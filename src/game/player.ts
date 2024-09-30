import {
  TActorWithOnUpdate,
  TAnimatedSpriteComponent,
  TEngine,
  TGameState,
  TOriginPoint,
  TPawn,
  TResourcePackConfig,
  TSceneComponent,
  TSimpleController,
  TSphereCollider,
  TSpriteLayer,
  TTextureFilter,
} from "@tedengine/ted";
import playerTexture from "../assets/pigeon.png";
import { vec3 } from "gl-matrix";

export default class Player extends TPawn implements TActorWithOnUpdate {
  public static resources: TResourcePackConfig = {
    textures: [
      {
        url: playerTexture,
        config: {
          filter: TTextureFilter.Nearest,
        },
      },
    ],
  };

  private simpleController: TSimpleController;
  private goingRight = true;

  private flapForce = 10;
  private flapRate = 0.5;
  private lastFlap = -100;

  constructor(engine: TEngine, state: TGameState, x: number, y: number) {
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
      32,
      32,
      TOriginPoint.Center,
      TSpriteLayer.Foreground_0,
      {
        frameCount: 12,
        frameRate: 12,
      },
    );
    sprite.applyTexture(engine, playerTexture);

    this.simpleController = new TSimpleController(state.events);
    this.simpleController.bindAction("Space", "pressed", () => {
      console.log("poop");
    });
  }

  public async onUpdate() {
    this.simpleController.update();

    // This ensures that if the player releases the left or right keys,
    // they will continue to move in that direction
    if (this.simpleController.getAxisValue("Horizontal") > 0) {
      this.goingRight = true;
    } else if (this.simpleController.getAxisValue("Horizontal") < 0) {
      this.goingRight = false;
    }

    const fx = this.goingRight ? 100 : -100;

    this.rootComponent.applyCentralForce(vec3.fromValues(fx, 0, 0));

    if (this.simpleController.getAxisValue("Vertical") > 0) {
      this.flap();
    }
  }

  private flap() {
    const now = performance.now();
    if (now - this.lastFlap < this.flapRate) {
      return;
    }

    this.lastFlap = now;
    this.rootComponent.applyCentralImpulse(
      vec3.fromValues(0, this.flapForce, 0),
    );
  }
}
