import { TGameState, TEngine, TResourcePack } from "@tedengine/ted";

class GameState extends TGameState {
  public async onCreate(engine: TEngine) {
    const rp = new TResourcePack(engine);
    await rp.load();

    this.onReady();
  }

  public beforeWorldCreate() {
    // Disable gravity
    this.world!.config.mode = "2d";
    this.world!.config.collisionClasses.push({
      name: "Player",
    });
  }

  public onUpdate() {}
  public onReady() {}
}

const config = {
  states: {
    game: GameState,
  },
  defaultState: "game",
};

new TEngine(config, self);
