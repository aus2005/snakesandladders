export const getX = (position) => {
    const row = 9 - Math.floor((position - 1) / 10);
    let col = (position - 1) % 10;
  
    if ((row + 1) % 2 === 0) {
      col = 9 - col;
    }
  
    return col * 50;
  };
  
  export const getY = (position) => {
    return (9 - Math.floor((position - 1) / 10)) * 50;
  };
  
  export const animateMove = (current, target, setPlayerPosition) => {
    let step = 1;
    const interval = setInterval(() => {
      if (current < target) {
        current += step;
        setPlayerPosition(current);
      } else {
        clearInterval(interval);
      }
    }, 300);
  };
  