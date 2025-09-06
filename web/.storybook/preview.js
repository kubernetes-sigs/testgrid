// Load Material Icons font for Storybook
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
document.head.appendChild(link);

export const parameters = {
  docs: {
    inlineStories: true,
  },
};