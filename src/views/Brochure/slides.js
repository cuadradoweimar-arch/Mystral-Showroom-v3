const images = import.meta.glob("../../assets/brochure/*.jpg", {
  eager: true,
  import: "default",
});

const files = [
  "inicio.jpg",
  "01.jpg",
  "02.jpg",
  "03.jpg",
  "04.jpg",
  "05.jpg",
  "06.jpg",
  "07.jpg",
  "08.jpg",
  "09.jpg",
  "010.jpg",
  "011.jpg",
  "012.jpg",
  "013.jpg",
  "014.jpg",
  "015.jpg",
  "016.jpg",
  "017.jpg",
  "018.jpg",
  "019.jpg",
  "020.jpg",
  "021.jpg",
  "022.jpg",
  "023.jpg",
  "024.jpg",
  "025.jpg",
  "026.jpg",
  "027.jpg",
  "028.jpg",
  "029.jpg",
  "030.jpg",
  "031.jpg",
  "032.jpg",
  "fin.jpg",
];

export const slides = files.map((file) => ({
  image: images[`../../assets/brochure/${file}`],
  type:
    file === "inicio.jpg"
      ? "start"
      : file === "fin.jpg"
      ? "end"
      : undefined,
}));

console.log(images);
console.log(slides);