for (let i = 0; i < 3; i++) layers.push(new Layer()); layers[3].context.fillStyle = "SkyBlue"; layers[3].context.font = "bold 100px sans-serif"; layers[1].context.globalAlpha = 0.5;
const images = []; const dir = "resources/images/"; const blood = [];
let money = "money" in localStorage ? Number(localStorage.getItem("money")) : 0; function setMoney(value) { money = value; if(money > 99) money = 99; if(money < 0) money = 0; localStorage.setItem("money", money); objects[1].render(); }
let pause = false; seed = (new Date()).getMilliseconds();

function load() {
  objects.push(new MoneyText()); for (let i = 0; i < 18; i++) images.push(new Image());

  images[0].src = dir + "menu.png";
  images[0].onload = () => images[1].src = dir+"UI/menu/play.png";
  images[1].onload = () => images[2].src = dir+"UI/menu/settings.png";
  images[2].onload = () => images[3].src = dir+"UI/menu/help.png";
  images[3].onload = () => images[4].src = dir+"UI/menu/titles.png";
  images[4].onload = () => images[5].src = dir+"UI/menu/rub.png";
  images[5].onload = () => menu();

  for (let i = 0; i < 1; i++) { blood.push(new Image()); blood[i].src = dir + "blood/" + i + ".png"; }
  images[6].src  = dir+"ground.png";
  images[7].src  = dir+"panel.png";
  images[8].src  = dir+"UI/button.png";
  images[9].src  = dir+"UI/task.png";
  images[10].src = dir+"UI/pause.png";
  images[11].src = dir+"UI/pausePanel.png";
  images[12].src = dir+"UI/back.png";
  images[13].src = dir+"active/0.png";
  images[14].src = dir+"active/1.png";
  images[15].src = dir+"active/2.png";
  images[16].src = dir+"coin.png";
  images[17].src = dir+"wall.png";
}

function clearScene() {
  const len = objects.length-2; for (let i = 0; i < len; i++) objects.pop();
  for (let i = 0; i < layers.length; i++) clearTransform(new Vector4(960, 540, 1920, 1080), i);
  objects[1].render(); renderImage(images[5], objects[1].transform, 3);
}
function menu() {
  clearScene(); renderImage(images[0], new Vector4(960, 540, 1920, 1080), 0);
  objects.push(new MenuButton(960, 225, 660,  180, images[1], () => { game(); }));
  objects.push(new MenuButton(960, 425, 1040, 150, images[2], () => {}));
  objects.push(new MenuButton(960, 625, 720,  180, images[3], () => {}));
  objects.push(new MenuButton(960, 825, 440,  180, images[4], () => {}));
}
function game() {
  clearScene(); pause = false; renderImage(images[6], new Vector4(540, 540, 1080, 1080), 0); renderImage(images[7], new Vector4(1500, 540, 840, 1080), 0);
  objects.push(new Task()); objects.push(new EnemyGenerator()); objects.push(new PauseButton()); objects.push(new Shutter());
  const position = new Vector2(1500, 560); let x = 540; for (let x = -1; x < 2; x++) { for (let y = -1; y < 2; y++) objects.push(new NumberButton(position.x + 180 * x, position.y + 180 * y, y * 3 + x + 5)); } objects.push(new NumberButton(position.x - 180, position.y + 360, "-")); objects.push(new NumberButton(position.x, position.y + 360, "0")); objects.push(new NumberButton(position.x + 180, position.y + 360, "<  "));
  objects.push(new ActiveButton(400, images[13], 1, () => objects[2].updateTask(), false)); objects.push(new BuildButton(540, images[14], 2, () => objects.push(new Wall()), true)); objects.push(new ActiveButton(680, images[15], 3, () => damage(10), false));
}

function gameOver() {
  pause = true; objects[4].transform.position.y -= 120; renderImage(images[11], new Vector4(540, 540, 1080, 1080), 2);
  objects.push(new MenuButton(90, 990, 180,  180, images[12], () => { menu(); }));
}

class MoneyText extends GameObject {
  constructor() { super(150, 40, 80, 80); this.textTransform = new Vector4(this.transform.position.x - 95, this.transform.position.y, 115, 100); this.render(); }
  render() {
    clearTransform(this.textTransform, 3); let text = money; if((money+"").length < 2) text = "0" + text;
    layers[3].context.fillText(text, this.transform.position.x - 150, this.transform.position.y + 35);
  }
}
class MenuButton extends Button {
  constructor(x, y, width, height, image, use) { super(x, y, width, height); this.image = image; this.use = use; this.render(); }
  animate(value) {
    clearTransform(this.transform, 3);
    this.transform.size.x *= value; this.transform.size.y *= value;
    this.render();
  }
  render() { renderImage(this.image, this.transform, 3); }
  onPress() { this.animate(0.8); }
  onRelease() { this.animate(1.25); this.use(); }
  onInterrupt() { this.animate(1.25); }
}

load();
