// src/declaration.d.ts

declare module '*.svg' {
  const content: string;
  export default content;
}

// You can add other assets here too:
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}