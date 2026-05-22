"""Render US road symbol sign PDF pages into public PNG assets."""

from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = ROOT / "app" / "assets" / "us_road_symbol_signs.pdf"
OUTPUT_DIR = ROOT / "public" / "assets" / "us-road-signs"


def main() -> None:
    doc = fitz.open(PDF_PATH)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for index in range(doc.page_count):
        page = doc[index]
        pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
        output_path = OUTPUT_DIR / f"sign-{index + 1:02d}.png"
        pixmap.save(output_path)
        print(output_path)


if __name__ == "__main__":
    main()
