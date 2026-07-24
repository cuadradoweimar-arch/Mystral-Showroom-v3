const images = import.meta.glob("../../assets/brochure/*.webp", {
  eager: true,
  import: "default",
});

const files = [
  "inicio.webp",
  "01.webp",
  "02.webp",
  "03.webp",
  "04.webp",
  "05.webp",
  "06.webp",
  "07.webp",
  "08.webp",
  "09.webp",
  "010.webp",
  "011.webp",
  "012.webp",
  "013.webp",
  "014.webp",
  "015.webp",
  "016.webp",
  "017.webp",
  "018.webp",
  "019.webp",
  "020.webp",
  "021.webp",
  "022.webp",
  "023.webp",
  "024.webp",
  "025.webp",
  "026.webp",
  "027.webp",
  "028.webp",
  "029.webp",
  "030.webp",
  "031.webp",
  "032.webp",
  "fin.webp",
];

export const slides = files.map((file) => ({
  image: images[`../../assets/brochure/${file}`],
  type:
    file === "inicio.webp"
      ? "start"
      : file === "fin.webp"
      ? "end"
      : undefined,
}));