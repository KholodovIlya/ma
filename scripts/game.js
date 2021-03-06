function damage(damage) { for (let i = 21; i < objects.length; i++) { if(objects[i] instanceof Enemy) objects[i].damage(damage); } }

class Animation {
  constructor(frames, speed) { this.frames = frames; this.image = this.frames[0]; this.frame = 0; this.speed = speed; this.с = 0; }
  update() {
    this.с++; if(this.с >= 60 / this.speed) {
      this.frame++; if(this.frame >= this.frames.length) this.frame = 0;
      this.image = this.frames[this.frame]; this.с = 0;
    }
  }
}

class Task extends GameObject {
  constructor() {
    super(1405, 180, 590, 200); this.currentAnswer = ""; this.rightAnswer = 0;
    this.answerTransform = new Vector4(this.transform.position.x + 380, this.transform.position.y, 180, 180);
    this.updateTask(); this.renderAnswer();
  }

  renderTask(text) {
    renderImage(images[9], this.transform, 3);
    layers[3].context.fillText(text, this.transform.position.x - 220, this.transform.position.y + 40);
  }
  renderAnswer() {
    renderImage(images[8], this.answerTransform, 3);
    layers[3].context.fillText(this.currentAnswer, this.answerTransform.position.x - 53, this.answerTransform.position.y + 35);
  }

  updateTask() {
    const num_1 = float2int(random() * 16);
    const num_2 = float2int(random() * 15);
    this.rightAnswer = num_1 + num_2;

    this.renderTask(num_1 + " + " + num_2);
  }
  updateAnswer(char) { this.currentAnswer += char; this.checkAnswer(); if(this.currentAnswer.length > 2) this.currentAnswer = ""; this.renderAnswer(); }
  checkAnswer() { if(this.currentAnswer == this.rightAnswer) { this.currentAnswer = ""; this.updateTask(); damage(1); } }
}
class NumberButton extends Button {
  constructor(x, y, char) { super(x, y, 180, 180); this.char = char; this.render(); }

  animate(value) {
    clearTransform(this.transform, 3);
    this.transform.size.x += value; this.transform.size.y += value;
    this.render();
  }
  render() {
    renderImage(images[8], this.transform, 3);
    layers[3].context.fillText(this.char, this.transform.position.x - 25, this.transform.position.y + 35);
  }

  collision(other) { if(!pause) super.collision(other); }
  onPress() { this.animate(-20); }
  onRelease() { this.animate(20); objects[2].updateAnswer(this.char); }
  onInterrupt() { this.animate(20); }
}
class Shutter extends GameObject { constructor() { super(540, 540, 1080, 1080); } update() { if(!pause) clearTransform(this.transform, 2); } }

class ActiveButton extends Button {
  constructor(x, image, cost, use) { super(x, 70, 140, 140); this.image = image; this.cost = cost; this.use = use; this.render(); }

  animate(value) {
    clearTransform(this.transform, 3);
    this.transform.size.x += value; this.transform.size.y += value;
    this.render();
  }
  render() {
    renderImage(images[8], this.transform, 3); if(this.image != null) renderImage(this.image, this.transform, 3);
    layers[3].context.fillText(this.cost, this.transform.position.x + 10, this.transform.position.y + 70);
  }

  collision(other) { if(!pause) super.collision(other); }
  onPress() { this.animate(-20); }
  onRelease() { this.animate(20); if(money >= this.cost) { setMoney(money - this.cost); this.use(); } }
  onInterrupt() { this.animate(20); }
}
class BuildButton extends ActiveButton {
  constructor(x, image, cost, use) { super(x, image, cost, use); }
  onRelease() { this.animate(20); }
  onInterrupt() { this.animate(20); if(money >= this.cost) { setMoney(money - this.cost); this.use(); } }
}
class PauseButton extends Button {
  constructor() { super(1020, 60, 120, 120); this.render(); }

  animate(value) {
    clearTransform(this.transform, 3);
    this.transform.size.x += value; this.transform.size.y += value;
    this.render();
  }
  render() { renderImage(images[8], this.transform, 3); renderImage(images[10], this.transform, 3); }

  onPress() { this.animate(-20); }
  onRelease() { this.animate(20); pause = !pause; renderImage(images[11], new Vector4(540, 540, 1080, 1080), 2); }
  onInterrupt() { this.animate(20); }
}

class Coin extends GameObject {
  constructor(x, y) { super(x, y, 65, 65); this.velocity = -(10 + float2int(random() * 10)); }
  update() {
    if(pause) return; this.transform.position.y += this.velocity; this.velocity += 1;
    if(this.transform.position.y > 1113) { setMoney(money+1); this.destroyed = true; } this.render();
  }
  render() { renderImage(images[16], this.transform, 2); }
}
class Wall extends GameObject {
  constructor() { super(0, 0, 360, 100); this.drag = true; this.maxHealth = 120 * 60; this.health = this.maxHealth; this.collide = false; }

  render() { layers[2].context.globalAlpha = this.health / this.maxHealth; renderImage(images[17], this.transform, 2); layers[2].context.globalAlpha = 1; }

  update() {
    if(pause) return; if(this.drag) {
      this.transform.position.x = mouse.transform.position.x; this.transform.position.y = mouse.transform.position.y;
      if(this.transform.position.x > 1080 - this.transform.size.x / 2) this.transform.position.x = 1080 - this.transform.size.x / 2; if(this.transform.position.x < this.transform.size.x / 2) this.transform.position.x = this.transform.size.x / 2;
      this.drag = mouse.down;
    } else { if(!this.collide & this.health < this.maxHealth) this.health += 40; this.collide = false; }
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
