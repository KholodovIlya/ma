for (let i = 0; i < 3; i++) layers.push(new Layer()); layers[3].context.fillStyle = "SkyBlue"; layers[3].context.font = "bold 100px sans-serif"; layers[1].context.globalAlpha = 0.5;
const images = []; const dir = "resources/images/"; fillImages(); seed = (new Date()).getMilliseconds();
const blood = []; for (let i = 0; i < 1; i++) { blood.push(new Image()); blood[i].src = dir + "blood/" + i + ".png"; }

let money = "money" in localStorage ? Number(localStorage.getItem("money")) : 0; let pause = false;
function fillImages() {
  for (let i = 0; i < 13; i++) images.push(new Image());
  images[0].src = dir + "panel.png"; images[1].src = dir + "taskPanel.png";
  images[2].src = dir + "button.png";
  images[4].src = dir + "back.png";
  images[5].src = dir + "active/0.png";
  images[6].src = dir + "active/1.png";
  images[7].src = dir + "active/2.png";
  images[8].src = dir + "build.png";
  images[11].src = dir + "pause.png";
  images[12].src = dir + "coin.png";
}
function menu() {
  objects.push(new MoneyText());renderImage(images[3], objects[1].transform, 3);
  renderImage(images[9], new Vector4(960, 540, 1920, 1080), 0);
  objects.push(new MenuButton(200, images[10], () => { clearScene(); game(); }));
  objects.push(new MenuButton(850, images[10], () => { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }));
}
function game() {
  objects.push(new Background()); objects.push(new Task()); objects.push(new EnemyGenerator()); objects.push(new PauseButton());
  let position = new Vector2(1500, 560); let x = 540;
  for (let x = -1; x < 2; x++) { for (let y = -1; y < 2; y++) objects.push(new NumberButton(position.x + 180 * x, position.y + 180 * y, y * 3 + x + 5)); }
  objects.push(new NumberButton(position.x - 180, position.y + 360, "-")); objects.push(new NumberButton(position.x, position.y + 360, "0")); objects.push(new NumberButton(position.x + 180, position.y + 360, "<  "));
  objects.push(new ActiveButton(x - 140, 1, images[5], () => objects[3].updateTask())); objects.push(new ActiveButton(x, 2, images[6], () => objects.push(new Wall()))); objects.push(new ActiveButton(x + 140, 3, images[7], () => damage(10)));
  renderImage(images[4], new Vector4(540, 540, 1080, 1080), 0); renderImage(images[0], new Vector4(1500, 540, 840, 1080), 0);
}
function clearScene() {
  const len = objects.length - 2; for (let i = 0; i < len; i++) objects.pop();
  for (let i = 0; i < layers.length; i++) clearTransform(new Vector4(960, 540, 1920, 1080), i);
  objects[1].render(); renderImage(images[3], objects[1].transform, 3);
}

class MoneyText extends GameObject {
  constructor() { super(150, 40, 80, 80); this.textTransform = new Vector4(this.transform.position.x - 95, this.transform.position.y, 110, 100); this.render(); }
  updateText(value) { money += value; if(money > 99) money = 99; localStorage.setItem("money", money); this.render(); }
  render() {
    clearTransform(this.textTransform, 3);
    let text = money; if((money + "").length < 2) text = "0" + text;
    layers[3].context.fillText(text, this.transform.position.x - 150, this.transform.position.y + 35);
  }
}

class MenuButton extends Button {
  constructor(y, image, use) { super(960, y, 660, 310); this.image = image; this.use = use; this.render(); }
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

images[3].src = dir + "rub.png";
images[3].onload = () => images[9].src = dir + "menuBack.png";
images[9].onload = () => images[10].src = dir + "playButton.png";
images[10].onload = () => menu();
