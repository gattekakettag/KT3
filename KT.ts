type Point = number;
type Distance = number;
type Angle = number;
type Position = { x: Point; y: Point };
enum CarriageState {
  UP,
  DOWN
}
enum LineColor {
  BLACK = "чорный",
  RED = "красный",
  GREEN = "зелёный"
};

interface Logger {
  log(message: string): void;
}

class LogToConsole implements Logger {
  log(message: string): void {
    console.log(message);
  }
}

class Plotter {
  private position: Position;
  private angle: Angle;
  private color: LineColor;
  private carriageState: CarriageState;
  private logger: Logger;

  constructor(logger: Logger) {
    this.position = { x: 0.0, y: 0.0 };
    this.angle = 0.0;
    this.color = LineColor.BLACK;
    this.carriageState = CarriageState.UP;
    this.logger = logger;
  }

  private drawLine(from: Position, to: Position, color: LineColor): void {
    this.logger.log(`...Чертим линию из (${from.x}, ${from.y}) в (${to.x}, ${to.y}) используя ${color} цвет.`);
  }

  private calcNewPosition(distance: Distance): Position {
    const angle_in_rads = this.angle * (Math.PI / 180.0) * 1.0;
    const x = this.position.x + distance * Math.cos(angle_in_rads);
    const y = this.position.y + distance * Math.sin(angle_in_rads);
    return { x: Math.round(x), y: Math.round(y) };
  }

  public move(distance: Distance): void {
    let newPosition = this.calcNewPosition(distance);
    if (this.carriageState === CarriageState.DOWN) {
      this.drawLine(this.position, newPosition, this.color);
    } else {
      this.logger.log(`Передвигаем на ${distance} от точки (${this.position.x}, ${this.position.y})`);
    }
    this.position = newPosition;
  }

  public turn(angle: Angle): void {
    this.logger.log(`Поворачиваем на ${angle} градусов`);
    this.angle = (this.angle + angle) % 360.0;
  }

  public carriageUp(): void {
    this.logger.log("Поднимаем каретку");
    this.carriageState = CarriageState.UP;
  }

  public carriageDown(): void {
    this.logger.log("Опускаем каретку");
    this.carriageState = CarriageState.DOWN;
  }

  public setColor(color: LineColor): void {
    this.logger.log(`Устанавливаем ${color} цвет линии.`);
    this.color = color;
  }

  public setPosition(position: Position): void {
    this.logger.log(`Устанавливаем позицию каретки в (${position.x}, ${position.y}).`);
    this.position = position;
  }
}

function drawTriangle(plt: Plotter, size: Distance): void {
  plt.setColor(LineColor.GREEN);
  for (let i = 0; i < 3; ++i) {
    plt.carriageDown();
    plt.move(size);
    plt.carriageUp();
    plt.turn(120.0);
  }
}

const plotter = new Plotter(new LogToConsole());
drawTriangle(plotter, 100.0);
