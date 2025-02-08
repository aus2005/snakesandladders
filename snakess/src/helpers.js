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

export const animateMove = async (current, target, setPosition, onComplete) => {
  if (current === target) {
    if (onComplete) onComplete();
    return;
  }

  const positions = [];
  let pos = current;
  const direction = current < target ? 1 : -1;
  
  while (pos !== target) {
    pos += direction;
    positions.push(pos);
  }

  for (const position of positions) {
    await new Promise(resolve => setTimeout(resolve, 600));
    setPosition(position);
  }

  if (onComplete) onComplete();
};