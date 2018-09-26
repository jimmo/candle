import { Control } from "./control";
import { EventSource } from "./events";

export class MenuItem extends Control {
  click: EventSource;
  down: boolean;

  constructor(readonly text: string, readonly icon?: string) {
    super();

    this.click = new EventSource();

    this.mousedown.add((ev) => {
      this.down = true;
      this.repaint();
    });
    this.mouseup.add((ev) => {
      this.down = false;
      this.parent.remove();
      this.click.fire();
    });
  }

  protected paint(ctx: CanvasRenderingContext2D) {
    super.paint(ctx);

    ctx.font = '18px sans'
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#202020'
    ctx.textAlign = 'left';
    ctx.fillText(this.text, 3, this.h / 2);
  }

  protected paintBackground(ctx: CanvasRenderingContext2D) {
    if (this.hovered) {
      ctx.fillStyle = '#ff0098';
      ctx.fillRect(0, 0, this.w, this.h);
    }
    if (this.down) {
      ctx.fillStyle = '#ff9800';
      ctx.fillRect(0, 0, this.w, this.h);
    }
  }

  protected defaultConstraints() {
    this.coords.w.set(180);
    this.coords.h.set(32);
  }
}

export class MenuHeadingItem extends Control {
  constructor(readonly text: string, readonly icon?: string) {
    super();
  }

  protected paint(ctx: CanvasRenderingContext2D) {
    super.paint(ctx);

    ctx.font = '18px sans'
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#606060'
    ctx.textAlign = 'left';
    ctx.fillText(this.text, 3, this.h / 2);
  }

  protected defaultConstraints() {
    this.coords.w.set(180);
    this.coords.h.set(32);
  }
}

export class MenuSeparatorItem extends Control {
  constructor() {
    super();
  }

  protected paint(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#a0a0a0';
    ctx.beginPath();
    ctx.moveTo(10, this.h / 2);
    ctx.lineTo(this.w - 10, this.h / 2);
    ctx.stroke();
  }

  protected defaultConstraints() {
    this.coords.w.set(180);
    this.coords.h.set(10);
  }
}

export type MenuItems = (MenuItem | MenuHeadingItem | MenuSeparatorItem)[];

export class Menu extends Control {
  constructor(items: MenuItems) {
    super();
    this.border = true;
    this.clip = false;

    let last: Control = null;

    for (const item of items) {
      this.add(item, { x: 1 });
      if (last) {
        item.coords.y.align(last.coords.yh);
      } else {
        item.coords.y.set(1);
      }
      last = item;
    }

    this.mousedown.add((ev) => {
      if (ev.control === this) {
        this.remove();
        ev.cancelBubble();
      }
    });
  }

  protected defaultConstraints() {
    super.defaultConstraints();
    this.coords.x.fit(1);
    this.coords.y.fit(1);
  }

  protected paintBackground(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#f0f0f0';
    ctx.shadowColor = '#c0c0c0';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.shadowColor = 'transparent';
  }

  protected added() {
    super.added();
    this.form.pushLayer(this);
  }

  protected removed() {
    super.removed();
    this.form.popLayer(this);
  }
}