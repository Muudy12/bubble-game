interface IBubble {
  id: number;
  visible: boolean;
}
class Bubble implements IBubble {
  constructor(id: number) {
    this.id = id;
    this.visible = true;
  }
  id: number;
  visible: boolean;
}

interface IScore {
  position: string;
  name: string;
  score: number;
}

export { Bubble };  
export type { IScore };

