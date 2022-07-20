class EnemyGenerator extends GameObject {
  constructor() {
    super(0, 0, 0, 0); this.c = 0; this.timeout = 3; this.animations = [];
    this.animations.push([]); for (let i = 0; i < 3; i++) { const img = new Image(); img.src = dir+"enemies/bug"+i+".png"; this.animations[0].push(img); } const img = new Image(); img.src = dir + "enemies/bug1.png"; this.animations[0].push(img);
  }
  update() { if(pause) return; this.c++; if(this.c >= this.timeout * 60) { objects.push(new Bug(new Animation(this.animations[0], 10))); this.c = 0; } }
}

class Enemy extends GameObject {
  constructor(width, height, health, animation) {
    super(float2int(random() * (1080 - width) + width / 2), height / -2, width, height);
    this.health = health; this.animation = animation; this.alfa = 1; this.dir = 0;
  }

  update() {
    if(pause) return; if(this.transform.position.y > 1080 + this.transform.size.y / 2) { gameOver(); this.destroyed = true; }
    this.alfa += this.dir; if(this.alfa <= 0) this.dir = 0.05; else if(this.alfa >= 1) this.dir = 0;
    this.animation.update(); this.enemyUpdate(); this.render();
  }

  render() { layers[2].context.globalAlpha = abs(this.alfa); renderImage(this.animation.image, this.transform, 2); layers[2].context.globalAlpha = 1; }

  damage(dmg) {
    this.health -= dmg; if(this.health <= 0) {
      this.destroyed = true; if(this.dead != null) this.dead();
      renderImage(blood[float2int(random() * blood.length)], new Vector4(this.transform.position.x, this.transform.position.y, this.transform.size.x, this.transform.size.x), 1);
      if(random() * 100 <= 33) objects.push(new Coin(this.transform.position.x, this.transform.position.y));
    }
    this.dir = -0.05;
  }

  collision(other) { }
}

class Bug extends Enemy { constructor(animation) { super(100, 100, 3, animation); } enemyUpdate() { this.transform.position.y += 1; } }
