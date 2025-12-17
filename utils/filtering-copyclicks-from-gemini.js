// Contoh response dari gemini
const apiResponse = {
  parts: [
    {
      text: "1. Taklukkan setiap medan dengan sepatu hiking kami yang tahan lama dan nyaman, mulai dari Rp 599.000.\n2. Dapatkan pengalaman mendaki terbaik dengan sepatu hiking anti selip dan waterproof, tersedia berbagai ukuran dan warna.\n3. Lindungi kaki Anda saat berpetualang dengan sepatu hiking berteknologi tinggi yang ringan dan breathable, diskon 20% untuk pembelian hari ini.\n"
    }
  ]
};

const rawText = apiResponse.parts?.[0]?.text ?? "";

// Split per baris → hilangkan baris kosong → hilangkan nomor "1. "
const promos = rawText
  .trim()
  .split("\n")
  .filter(line => line.trim() !== "")
  .map(line => line.replace(/^\d+\.\s*/, ""));

console.log(promos);

// Output ad set:
// [
//   'Taklukkan setiap medan dengan sepatu hiking kami yang tahan lama dan nyaman, mulai dari Rp 599.000.',
//   'Dapatkan pengalaman mendaki terbaik dengan sepatu hiking anti selip dan waterproof, tersedia berbagai ukuran dan warna.',
//   'Lindungi kaki Anda saat berpetualang dengan sepatu hiking berteknologi tinggi yang ringan dan breathable, diskon 20% untuk pembelian hari ini.'
// ]