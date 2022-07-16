class Animation {
  constructor(speed) { this.image; this.frames = []; this.frame = 0; this.speed = speed; this.с = 0; }
  update() {
    this.с++; if(this.с >= 60 / this.speed) {
      this.frame++; if(this.frame >= this.frames.length) this.frame = 0;
      this.image = this.frames[this.frame];
      this.с = 0;
    }
  }
}

function gameOver() { clearScene(); menu(); }
function damage(damage) { for (let i = 21; i < objects.length; i++) { if(objects[i] instanceof Enemy) objects[i].damage(damage); } }

class Task extends GameObject {
  constructor() {
    super(1405, 180, 590, 200); this.currentAnswer = ""; this.rightAnswer = 0;
    this.answerTransform = new Vector4(this.transform.position.x + 380, this.transform.position.y, 180, 180);
    this.updateTask(); this.renderAnswer();
  }

  renderTask(text) {
    renderImage(images[1], this.transform, 3);
    layers[3].context.fillText(text, this.transform.position.x - 220, this.transform.position.y + 40);
  }
  renderAnswer() {
    renderImage(images[2], this.answerTransform, 3);
    layers[3].context.fillText(this.currentAnswer, this.answerTransform.position.x - 53, this.answerTransform.position.y + 35);
  }

  updateTask() {
    const num_1 = float2int(random() * 20);
    const num_2 = float2int(random() * 20);
    this.rightAnswer = num_1 + num_2;

    this.renderTask(num_1 + " + " + num_2);
  }
  updateAnswer(char) { this.currentAnswer += char; this.checkAnswer(); if(this.currentAnswer.length > 2) this.currentAnswer = ""; this.renderAnswer(); }
  checkAnswer() { if(this.currentAnswer == this.rightAnswer) { this.currentAnswer = ""; this.updateTask(); damage(1); } }
}
class NumberButton extends Button {
  constructor(x, y, char) { super(x, y, 180, 180); this.char = char; this.render(); }

  update() { if(!pause) super.update(); }
  animate(value) {
    clearTransform(this.transform, 3);
    this.transform.size.x += value; this.transform.size.y += value;
    this.render();
  }
  render() {
    renderImage(images[2], this.transform, 3);
    layers[3].context.fillText(this.char, this.transform.position.x - 25, this.transform.position.y + 35);
  }

  onPress() { this.animate(-20); }
  onRelease() { this.animate(20); objects[3].updateAnswer(this.char); }
  onInterrupt() { this.animate(20); }

  collision(other) { if(!pause) super.collision(other); }
}
class Background extends GameObject { constructor() { super(540, 540, 1080, 1080); } update() { if(!pause) clearTransform(this.transform, 2); } }

class ActiveButton extends Button {
  constructor(x, cost, image, use) { super(x, 70, 140, 140); this.cost = cost; this.image = image; this.use = use; this.render(); }

  update() { if(!pause) super.update(); }
  animate(value) {
    clearTransform(this.transform, 3);
    this.transform.size.x += value; this.transform.size.y += value;
    this.render();
  }
  render() {
    renderImage(images[2], this.transform, 3); if(this.image != null) renderImage(this.image, this.transform, 3);
    layers[3].context.fillText(this.cost, this.transform.position.x + 10, this.transform.position.y + 70);
  }

  onPress() { this.animate(-20); }
  onRelease() { this.animate(20); if(money >= this.cost) { objects[1].updateText(-this.cost); this.use(); } }
  onInterrupt() { this.animate(20); }

  collision(other) { if(!pause) super.collision(other); }
}
class Wall extends GameObject {
  constructor() { super(0, 0, 360, 100); this.drag = true; this.maxHealth = 120 * 60; this.health = this.maxHealth; this.collide = false; }

  render() {
    layers[2].context.globalAlpha = this.health / this.maxHealth;
    renderImage(images[8], this.transform, 2); layers[2].context.globalAlpha = 1;
  }

  update() {
    if(pause) { this.render(); return; }
    if(this.drag) {
      this.transform.position.x = mouse.transform.position.x; this.transform.position.y = mouse.transform.position.y;
      if(this.transform.position.x > 1080 - this.transform.size.x / 2) this.transform.position.x = 1080 - this.transform.size.x / 2;
      if(this.transform.position.x < this.transform.size.x / 2) this.transform.position.x = this.transform.size.x / 2;
      this.drag = !mouse.down;
    } else {
      if(!this.collide & this.health < this.maxHealth) this.health += 40;
      this.collide = false;
    }
    this.render();
  }

  collision(other) {
    if(!this.drag & other instanceof Enemy) {
      this.health -= 1; if(this.health <= 0) this.destroyed = true;
      other.transform.position.y = this.transform.position.y - (this.transform.size.y + other.transform.size.y) / 2;
      this.collide = true;
    }
  }
}
class PauseButton extends Button {
  constructor() { super(1020, 60, 120, 120); this.render(); }

  animate(value) {
    clearTransform(this.transform, 3);
    this.transform.size.x += value; this.transform.size.y += value;
    this.render();
  }
  render() { renderImage(images[2], this.transform, 3); renderImage(images[11], this.transform, 3); }

  onPress() { this.animate(-20); }
  onRelease() { this.animate(20); pause = !pause; }
  onInterrupt() { this.animate(20); }
}

class EnemyGenerator extends GameObject {
  constructor() { super(0, 0, 0, 0); this.c = 0; this.timeout = 3; }
  update() { if(pause) return; this.c++; if(this.c >= this.timeout * 60) { objects.push(new Bug()); this.c = 0; } }
}
class Enemy extends GameObject {
  constructor(width, height, health, dmg, animation) {
    super(float2int(random() * (1080 - width) + width / 2), height / -2, width, height);
    this.health = health; this.dmg = dmg; this.animation = animation; this.alfa = 1; this.dir = 0;
  }

  update() {
    if(pause) { renderImage(this.animation.image, this.transform, 2); return; }
    if(this.transform.position.y > 1080 + this.transform.size.y / 2) { gameOver(); this.destroyed = true; }
    this.alfa += this.dir; if(this.alfa <= 0) this.dir = 0.05; else if(this.alfa >= 1) this.dir = 0;
    this.animation.update(); this.enemyUpdate(); this.render();
  }

  render() {
    layers[2].context.globalAlpha = abs(this.alfa);
    renderImage(this.animation.image, this.transform, 2); layers[2].context.globalAlpha = 1;
  }

  damage(dmg) {
    this.health -= dmg; if(this.health <= 0) {
      this.destroyed = true; if(this.dead != null) this.dead();
      renderImage(blood[float2int(random() * blood.length)], new Vector4(this.transform.position.x, this.transform.position.y, this.transform.size.x, this.transform.size.x), 1);
    }
    this.dir = -0.05;
  }

  collision(other) { }
}

class Bug extends Enemy {
  constructor() {
    const animation = new Animation(10); for (let i = 0; i < 3; i++) { const img = new Image(); img.src = dir + "enemies/bug" + i + ".png"; animation.frames.push(img); } const img = new Image(); img.src = dir + "enemies/bug1.png"; animation.frames.push(img); animation.image = animation.frames[0];
    super(100, 100, 3, 3, animation);
  }
  enemyUpdate() { this.transform.position.y += 1; }
}
