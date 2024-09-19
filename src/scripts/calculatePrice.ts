export default function calculatePrice(ki: string): number {
  ki = ki.toLowerCase();
  switch (ki) {
    case 'unknown': {
      return 10;
    }
    case 'billion': {
      return Number.parseFloat(ki) * 2 + 10;
    }
    case 'trillion': {
      return Number.parseFloat(ki) * 3 + 10;
    }
    case 'quadrillion ': {
      return Number.parseFloat(ki) * 4 + 10;
    }
    case 'quintillion': {
      return Number.parseFloat(ki) * 5 + 10;
    }
    case 'deptillion': {
      return Number.parseFloat(ki) * 6 + 10;
    }
    case 'googolplex': {
      return Number.parseFloat(ki) * 7 + 10;
    }
    default: {
      return Number.parseFloat(ki) * 8 + 10;
    }
  }
}
