/**
 * columns-anniversary — a full-width decorative anniversary banner.
 * Text ("Celebrating 75 Years of Saga") alongside decorative emblem images,
 * laid out as horizontal columns. Extends the columns pattern.
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-anniversary-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-anniversary-img-col');
        }
      }
    });
  });
}
