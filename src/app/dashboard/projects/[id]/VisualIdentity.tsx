"use client";

import {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type ImageItem = {
  id: string;
  url: string;
  publicId: string | null;
  prompt: string | null;
  createdAt: string;
};

type Props = {
  projectId: string;
};

type VisualType =
  | "flyer"
  | "instagram"
  | "whatsapp"
  | "promotion"
  | "business-card";

type TemplateStyle =
  | "minimal"
  | "modern"
  | "premium"
  | "promotion";

const visualTypes: {
  id: VisualType;
  title: string;
  description: string;
  icon: string;
  width: number;
  height: number;
}[] = [
  {
    id: "flyer",
    title: "Flyer publicitaire",
    description: "Présentez votre activité et vos offres.",
    icon: "✦",
    width: 1080,
    height: 1350,
  },
  {
    id: "instagram",
    title: "Publication Instagram",
    description: "Un visuel carré pour vos réseaux.",
    icon: "◎",
    width: 1080,
    height: 1080,
  },
  {
    id: "whatsapp",
    title: "Story WhatsApp",
    description: "Un visuel vertical pour vos stories.",
    icon: "◈",
    width: 1080,
    height: 1920,
  },
  {
    id: "promotion",
    title: "Offre promotionnelle",
    description: "Mettez une promotion en avant.",
    icon: "%",
    width: 1080,
    height: 1350,
  },
  {
    id: "business-card",
    title: "Carte de visite",
    description: "Présentez votre entreprise simplement.",
    icon: "▣",
    width: 1200,
    height: 675,
  },
];

const templates: {
  id: TemplateStyle;
  title: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "minimal",
    title: "Minimal",
    description: "Épuré, simple et élégant.",
    icon: "○",
  },
  {
    id: "modern",
    title: "Moderne",
    description: "Dynamique et contemporain.",
    icon: "◆",
  },
  {
    id: "premium",
    title: "Premium",
    description: "Élégant et haut de gamme.",
    icon: "◇",
  },
  {
    id: "promotion",
    title: "Promotion",
    description: "Pensé pour attirer l'attention.",
    icon: "%",
  },
];

export default function VisualIdentity({
  projectId,
}: Props) {
  const [images, setImages] = useState<ImageItem[]>([]);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [selectedImageUrl, setSelectedImageUrl] =
    useState<string | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [sector, setSector] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [slogan, setSlogan] = useState("");
  const [colors, setColors] = useState("#111111");

  const [visualType, setVisualType] =
    useState<VisualType>("flyer");

  const [template, setTemplate] =
    useState<TemplateStyle>("modern");

  const [loadingImages, setLoadingImages] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] = useState("");

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [pngPreviewUrl, setPngPreviewUrl] =
    useState<string | null>(null);

  const selectedVisual = useMemo(
    () =>
      visualTypes.find(
        (visual) => visual.id === visualType
      ) ?? visualTypes[0],
    [visualType]
  );

  async function loadImages() {
    try {
      setLoadingImages(true);

      const response = await fetch(
        `/api/projects/${projectId}/images`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible de récupérer les visuels."
        );
      }

      setImages(data.images ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de récupérer les visuels."
      );
    } finally {
      setLoadingImages(false);
    }
  }

  useEffect(() => {
    loadImages();
  }, [projectId]);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      setSelectedImageUrl(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image.");
      setSelectedFile(null);
      setSelectedImageUrl(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 10 Mo.");
      setSelectedFile(null);
      setSelectedImageUrl(null);
      return;
    }

    setError("");
    setSelectedFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedImageUrl(reader.result);
      } else {
        setSelectedImageUrl(null);
      }
    };

    reader.onerror = () => {
      setError(
        "Impossible de lire l'image sélectionnée."
      );
      setSelectedImageUrl(null);
    };

    reader.readAsDataURL(file);
  }

  function escapeXml(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function safe(value: string, fallback: string) {
    return escapeXml(
      value.trim() || fallback
    );
  }

  function buildSvg() {
    const width = selectedVisual.width;
    const height = selectedVisual.height;

    const company = safe(
      companyName,
      "Votre entreprise"
    );

    const sectorText = safe(
      sector,
      "Votre activité"
    );

    const descriptionText = safe(
      description,
      "Des produits et services pensés pour vous."
    );

    const targetText = safe(
      target,
      "Pour nos clients"
    );

    const priceText = safe(price, "");
    const phoneText = safe(phone, "");
    const addressText = safe(address, "");
    const sloganText = safe(slogan, "");

    const accent =
      colors || "#111111";

    const imageData = selectedImageUrl;

    const title =
      visualType === "promotion"
        ? "OFFRE SPÉCIALE"
        : company;

    const subtitle =
      visualType === "promotion"
        ? descriptionText
        : sloganText || sectorText;

    /*
     * CARTE DE VISITE
     */

    if (visualType === "business-card") {
      if (template === "premium") {
        return `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="${width}"
            height="${height}"
            viewBox="0 0 ${width} ${height}"
          >
            <rect
              width="100%"
              height="100%"
              fill="#111111"
            />

            <rect
              x="30"
              y="30"
              width="${width - 60}"
              height="${height - 60}"
              rx="32"
              fill="#181818"
              stroke="${accent}"
              stroke-width="3"
            />

            ${
              imageData
                ? `
                  <clipPath id="cardImage">
                    <rect
                      x="85"
                      y="135"
                      width="280"
                      height="280"
                      rx="30"
                    />
                  </clipPath>

                  <image
                    href="${imageData}"
                    x="85"
                    y="135"
                    width="280"
                    height="280"
                    preserveAspectRatio="xMidYMid slice"
                    clip-path="url(#cardImage)"
                  />
                `
                : `
                  <rect
                    x="85"
                    y="135"
                    width="280"
                    height="280"
                    rx="30"
                    fill="${accent}"
                    opacity="0.2"
                  />

                  <text
                    x="225"
                    y="295"
                    text-anchor="middle"
                    font-family="Arial, sans-serif"
                    font-size="60"
                    fill="${accent}"
                  >
                    ${company.charAt(0)}
                  </text>
                `
            }

            <text
              x="440"
              y="175"
              font-family="Arial, sans-serif"
              font-size="25"
              letter-spacing="5"
              fill="${accent}"
            >
              ${sectorText.toUpperCase()}
            </text>

            <text
              x="440"
              y="245"
              font-family="Arial, sans-serif"
              font-size="58"
              font-weight="700"
              fill="#ffffff"
            >
              ${company}
            </text>

            ${
              sloganText
                ? `
                  <text
                    x="440"
                    y="300"
                    font-family="Arial, sans-serif"
                    font-size="25"
                    fill="#bbbbbb"
                  >
                    ${sloganText}
                  </text>
                `
                : ""
            }

            <line
              x1="440"
              y1="355"
              x2="1090"
              y2="355"
              stroke="${accent}"
              stroke-width="2"
            />

            ${
              phoneText
                ? `
                  <text
                    x="440"
                    y="430"
                    font-family="Arial, sans-serif"
                    font-size="27"
                    fill="#ffffff"
                  >
                    ${phoneText}
                  </text>
                `
                : ""
            }

            ${
              addressText
                ? `
                  <text
                    x="440"
                    y="480"
                    font-family="Arial, sans-serif"
                    font-size="22"
                    fill="#aaaaaa"
                  >
                    ${addressText}
                  </text>
                `
                : ""
            }

            <text
              x="85"
              y="575"
              font-family="Arial, sans-serif"
              font-size="17"
              letter-spacing="3"
              fill="#777777"
            >
              ${targetText.toUpperCase()}
            </text>
          </svg>
        `;
      }

      return `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="${width}"
          height="${height}"
          viewBox="0 0 ${width} ${height}"
        >
          <rect
            width="100%"
            height="100%"
            fill="${
              template === "modern"
                ? accent
                : "#f7f7f4"
            }"
          />

          ${
            template === "modern"
              ? `
                <circle
                  cx="1080"
                  cy="0"
                  r="300"
                  fill="#ffffff"
                  opacity="0.08"
                />

                <circle
                  cx="1050"
                  cy="675"
                  r="240"
                  fill="#ffffff"
                  opacity="0.05"
                />
              `
              : ""
          }

          ${
            imageData
              ? `
                <clipPath id="businessImage">
                  <rect
                    x="70"
                    y="100"
                    width="320"
                    height="320"
                    rx="30"
                  />
                </clipPath>

                <image
                  href="${imageData}"
                  x="70"
                  y="100"
                  width="320"
                  height="320"
                  preserveAspectRatio="xMidYMid slice"
                  clip-path="url(#businessImage)"
                />
              `
              : `
                <rect
                  x="70"
                  y="100"
                  width="320"
                  height="320"
                  rx="30"
                  fill="${
                    template === "modern"
                      ? "#ffffff"
                      : accent
                  }"
                  opacity="0.12"
                />
              `
          }

          <text
            x="455"
            y="155"
            font-family="Arial, sans-serif"
            font-size="25"
            letter-spacing="4"
            fill="${
              template === "modern"
                ? "#ffffff"
                : accent
            }"
          >
            ${sectorText.toUpperCase()}
          </text>

          <text
            x="455"
            y="230"
            font-family="Arial, sans-serif"
            font-size="58"
            font-weight="700"
            fill="${
              template === "modern"
                ? "#ffffff"
                : "#111111"
            }"
          >
            ${company}
          </text>

          ${
            sloganText
              ? `
                <text
                  x="455"
                  y="285"
                  font-family="Arial, sans-serif"
                  font-size="25"
                  fill="${
                    template === "modern"
                      ? "#ffffff"
                      : "#555555"
                  }"
                >
                  ${sloganText}
                </text>
              `
              : ""
          }

          <line
            x1="455"
            y1="345"
            x2="1110"
            y2="345"
            stroke="${
              template === "modern"
                ? "#ffffff"
                : "#dddddd"
            }"
            stroke-width="2"
            opacity="0.6"
          />

          ${
            phoneText
              ? `
                <text
                  x="455"
                  y="420"
                  font-family="Arial, sans-serif"
                  font-size="27"
                  font-weight="600"
                  fill="${
                    template === "modern"
                      ? "#ffffff"
                      : "#222222"
                  }"
                >
                  ${phoneText}
                </text>
              `
              : ""
          }

          ${
            addressText
              ? `
                <text
                  x="455"
                  y="470"
                  font-family="Arial, sans-serif"
                  font-size="22"
                  fill="${
                    template === "modern"
                      ? "#dddddd"
                      : "#666666"
                  }"
                >
                  ${addressText}
                </text>
              `
              : ""
          }
        </svg>
      `;
    }

    /*
     * PROMOTION
     */

    if (
      visualType === "promotion" ||
      template === "promotion"
    ) {
      const imageHeight =
        Math.round(height * 0.44);

      return `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="${width}"
          height="${height}"
          viewBox="0 0 ${width} ${height}"
        >
          <rect
            width="100%"
            height="100%"
            fill="#f7f7f4"
          />

          <rect
            x="0"
            y="0"
            width="100%"
            height="${Math.round(height * 0.55)}"
            fill="${accent}"
          />

          <circle
            cx="${width - 90}"
            cy="80"
            r="160"
            fill="#ffffff"
            opacity="0.12"
          />

          <text
            x="${Math.round(width * 0.08)}"
            y="${Math.round(height * 0.10)}"
            font-family="Arial, sans-serif"
            font-size="28"
            font-weight="700"
            letter-spacing="5"
            fill="#ffffff"
          >
            ${sectorText.toUpperCase()}
          </text>

          ${
            imageData
              ? `
                <clipPath id="promotionImage">
                  <rect
                    x="${Math.round(width * 0.08)}"
                    y="${Math.round(height * 0.15)}"
                    width="${Math.round(width * 0.84)}"
                    height="${imageHeight}"
                    rx="34"
                  />
                </clipPath>

                <image
                  href="${imageData}"
                  x="${Math.round(width * 0.08)}"
                  y="${Math.round(height * 0.15)}"
                  width="${Math.round(width * 0.84)}"
                  height="${imageHeight}"
                  preserveAspectRatio="xMidYMid slice"
                  clip-path="url(#promotionImage)"
                />
              `
              : `
                <rect
                  x="${Math.round(width * 0.08)}"
                  y="${Math.round(height * 0.15)}"
                  width="${Math.round(width * 0.84)}"
                  height="${imageHeight}"
                  rx="34"
                  fill="#ffffff"
                  opacity="0.12"
                />
              `
          }

          <text
            x="${Math.round(width * 0.08)}"
            y="${Math.round(height * 0.68)}"
            font-family="Arial, sans-serif"
            font-size="62"
            font-weight="800"
            fill="#111111"
          >
            ${title}
          </text>

          <text
            x="${Math.round(width * 0.08)}"
            y="${Math.round(height * 0.74)}"
            font-family="Arial, sans-serif"
            font-size="31"
            font-weight="600"
            fill="${accent}"
          >
            ${subtitle}
          </text>

          ${
            priceText
              ? `
                <rect
                  x="${Math.round(width * 0.08)}"
                  y="${Math.round(height * 0.79)}"
                  width="390"
                  height="92"
                  rx="25"
                  fill="${accent}"
                />

                <text
                  x="${Math.round(width * 0.08) + 195}"
                  y="${Math.round(height * 0.79) + 58}"
                  text-anchor="middle"
                  font-family="Arial, sans-serif"
                  font-size="31"
                  font-weight="800"
                  fill="#ffffff"
                >
                  ${priceText}
                </text>
              `
              : ""
          }

          ${
            phoneText
              ? `
                <text
                  x="${Math.round(width * 0.08)}"
                  y="${Math.round(height * 0.92)}"
                  font-family="Arial, sans-serif"
                  font-size="26"
                  font-weight="700"
                  fill="#222222"
                >
                  ${phoneText}
                </text>
              `
              : ""
          }

          ${
            addressText
              ? `
                <text
                  x="${Math.round(width * 0.08)}"
                  y="${Math.round(height * 0.965)}"
                  font-family="Arial, sans-serif"
                  font-size="20"
                  fill="#666666"
                >
                  ${addressText}
                </text>
              `
              : ""
          }
        </svg>
      `;
    }

    /*
     * AUTRES FORMATS
     */

    const imageHeight =
      visualType === "whatsapp"
        ? Math.round(height * 0.43)
        : Math.round(height * 0.42);

    const imageY =
      visualType === "whatsapp"
        ? Math.round(height * 0.06)
        : Math.round(height * 0.07);

    /*
     * PREMIUM
     */

    if (template === "premium") {
      return `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="${width}"
          height="${height}"
          viewBox="0 0 ${width} ${height}"
        >
          <rect
            width="100%"
            height="100%"
            fill="#111111"
          />

          <rect
            x="35"
            y="35"
            width="${width - 70}"
            height="${height - 70}"
            rx="35"
            fill="#181818"
            stroke="${accent}"
            stroke-width="3"
          />

          <text
            x="${Math.round(width * 0.08)}"
            y="${Math.round(height * 0.10)}"
            font-family="Arial, sans-serif"
            font-size="22"
            letter-spacing="6"
            fill="${accent}"
          >
            ${sectorText.toUpperCase()}
          </text>

          ${
            imageData
              ? `
                <clipPath id="premiumImage">
                  <rect
                    x="${Math.round(width * 0.08)}"
                    y="${imageY}"
                    width="${Math.round(width * 0.84)}"
                    height="${imageHeight}"
                    rx="30"
                  />
                </clipPath>

                <image
                  href="${imageData}"
                  x="${Math.round(width * 0.08)}"
                  y="${imageY}"
                  width="${Math.round(width * 0.84)}"
                  height="${imageHeight}"
                  preserveAspectRatio="xMidYMid slice"
                  clip-path="url(#premiumImage)"
                />
              `
              : `
                <rect
                  x="${Math.round(width * 0.08)}"
                  y="${imageY}"
                  width="${Math.round(width * 0.84)}"
                  height="${imageHeight}"
                  rx="30"
                  fill="${accent}"
                  opacity="0.16"
                />
              `
          }

          <text
            x="${Math.round(width * 0.08)}"
            y="${Math.round(height * 0.62)}"
            font-family="Arial, sans-serif"
            font-size="58"
            font-weight="700"
            fill="#ffffff"
          >
            ${company}
          </text>

          ${
            sloganText
              ? `
                <text
                  x="${Math.round(width * 0.08)}"
                  y="${Math.round(height * 0.68)}"
                  font-family="Arial, sans-serif"
                  font-size="27"
                  fill="${accent}"
                >
                  ${sloganText}
                </text>
              `
              : ""
          }

          <text
            x="${Math.round(width * 0.08)}"
            y="${Math.round(height * 0.75)}"
            font-family="Arial, sans-serif"
            font-size="23"
            fill="#bbbbbb"
          >
            ${descriptionText}
          </text>

          ${
            priceText
              ? `
                <text
                  x="${Math.round(width * 0.08)}"
                  y="${Math.round(height * 0.84)}"
                  font-family="Arial, sans-serif"
                  font-size="34"
                  font-weight="700"
                  fill="${accent}"
                >
                  ${priceText}
                </text>
              `
              : ""
          }

          ${
            phoneText
              ? `
                <text
                  x="${Math.round(width * 0.08)}"
                  y="${Math.round(height * 0.93)}"
                  font-family="Arial, sans-serif"
                  font-size="23"
                  fill="#ffffff"
                >
                  ${phoneText}
                </text>
              `
              : ""
          }
        </svg>
      `;
    }

    /*
     * MODERNE
     */

    if (template === "modern") {
      return `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="${width}"
          height="${height}"
          viewBox="0 0 ${width} ${height}"
        >
          <rect
            width="100%"
            height="100%"
            fill="#f7f7f4"
          />

          <path
            d="M0 0 H${width} V${Math.round(
              height * 0.54
            )} C${Math.round(
              width * 0.72
            )} ${Math.round(
              height * 0.48
            )} ${Math.round(
              width * 0.40
            )} ${Math.round(
              height * 0.62
            )} 0 ${Math.round(
              height * 0.50
            )} Z"
            fill="${accent}"
          />

          ${
            imageData
              ? `
                <clipPath id="modernImage">
                  <rect
                    x="${Math.round(width * 0.08)}"
                    y="${imageY}"
                    width="${Math.round(width * 0.84)}"
                    height="${imageHeight}"
                    rx="35"
                  />
                </clipPath>

                <image
                  href="${imageData}"
                  x="${Math.round(width * 0.08)}"
                  y="${imageY}"
                  width="${Math.round(width * 0.84)}"
                  height="${imageHeight}"
                  preserveAspectRatio="xMidYMid slice"
                  clip-path="url(#modernImage)"
                />
              `
              : ""
          }

          <text
            x="${Math.round(width * 0.08)}"
            y="${Math.round(height * 0.59)}"
            font-family="Arial, sans-serif"
            font-size="58"
            font-weight="800"
            fill="#111111"
          >
            ${company}
          </text>

          <text
            x="${Math.round(width * 0.08)}"
            y="${Math.round(height * 0.66)}"
            font-family="Arial, sans-serif"
            font-size="30"
            font-weight="600"
            fill="${accent}"
          >
            ${subtitle}
          </text>

          <text
            x="${Math.round(width * 0.08)}"
            y="${Math.round(height * 0.74)}"
            font-family="Arial, sans-serif"
            font-size="23"
            fill="#555555"
          >
            ${descriptionText}
          </text>

          ${
            priceText
              ? `
                <rect
                  x="${Math.round(width * 0.08)}"
                  y="${Math.round(height * 0.81)}"
                  width="330"
                  height="80"
                  rx="20"
                  fill="${accent}"
                />

                <text
                  x="${Math.round(width * 0.08) + 165}"
                  y="${Math.round(height * 0.81) + 51}"
                  text-anchor="middle"
                  font-family="Arial, sans-serif"
                  font-size="29"
                  font-weight="800"
                  fill="#ffffff"
                >
                  ${priceText}
                </text>
              `
              : ""
          }

          ${
            phoneText
              ? `
                <text
                  x="${Math.round(width * 0.08)}"
                  y="${Math.round(height * 0.94)}"
                  font-family="Arial, sans-serif"
                  font-size="23"
                  font-weight="700"
                  fill="#222222"
                >
                  ${phoneText}
                </text>
              `
              : ""
          }
        </svg>
      `;
    }

    /*
     * MINIMAL
     */

    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="${width}"
        height="${height}"
        viewBox="0 0 ${width} ${height}"
      >
        <rect
          width="100%"
          height="100%"
          fill="#ffffff"
        />

        <rect
          x="0"
          y="0"
          width="100%"
          height="18"
          fill="${accent}"
        />

        ${
          imageData
            ? `
              <clipPath id="minimalImage">
                <rect
                  x="${Math.round(width * 0.10)}"
                  y="${imageY}"
                  width="${Math.round(width * 0.80)}"
                  height="${imageHeight}"
                  rx="22"
                />
              </clipPath>

              <image
                href="${imageData}"
                x="${Math.round(width * 0.10)}"
                y="${imageY}"
                width="${Math.round(width * 0.80)}"
                height="${imageHeight}"
                preserveAspectRatio="xMidYMid slice"
                clip-path="url(#minimalImage)"
              />
            `
            : `
              <rect
                x="${Math.round(width * 0.10)}"
                y="${imageY}"
                width="${Math.round(width * 0.80)}"
                height="${imageHeight}"
                rx="22"
                fill="#f2f2ef"
              />

              <text
                x="${width / 2}"
                y="${Math.round(
                  imageY + imageHeight / 2
                )}"
                text-anchor="middle"
                font-family="Arial, sans-serif"
                font-size="28"
                fill="#999999"
              >
                ${sectorText}
              </text>
            `
        }

        <text
          x="${Math.round(width * 0.10)}"
          y="${Math.round(height * 0.62)}"
          font-family="Arial, sans-serif"
          font-size="54"
          font-weight="700"
          fill="#111111"
        >
          ${company}
        </text>

        <text
          x="${Math.round(width * 0.10)}"
          y="${Math.round(height * 0.69)}"
          font-family="Arial, sans-serif"
          font-size="28"
          fill="${accent}"
        >
          ${subtitle}
        </text>

        <text
          x="${Math.round(width * 0.10)}"
          y="${Math.round(height * 0.77)}"
          font-family="Arial, sans-serif"
          font-size="22"
          fill="#666666"
        >
          ${descriptionText}
        </text>

        ${
          priceText
            ? `
              <text
                x="${Math.round(width * 0.10)}"
                y="${Math.round(height * 0.85)}"
                font-family="Arial, sans-serif"
                font-size="30"
                font-weight="700"
                fill="#111111"
              >
                ${priceText}
              </text>
            `
            : ""
        }

        ${
          phoneText
            ? `
              <text
                x="${Math.round(width * 0.10)}"
                y="${Math.round(height * 0.94)}"
                font-family="Arial, sans-serif"
                font-size="22"
                fill="#333333"
              >
                ${phoneText}
              </text>
            `
            : ""
        }
      </svg>
    `;
  }

  /*
   * APERÇU TEMPS RÉEL
   */

  useEffect(() => {
    try {
      const svg = buildSvg();
      const dataUrl = svgToDataUrl(svg);

      setPreviewUrl(dataUrl);

      const image = new Image();

      image.onload = () => {
        const canvas =
          document.createElement("canvas");

        canvas.width = selectedVisual.width;
        canvas.height = selectedVisual.height;

        const context =
          canvas.getContext("2d");

        if (!context) {
          return;
        }

        context.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        context.drawImage(
          image,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const pngUrl =
          canvas.toDataURL(
            "image/png",
            1
          );

        setPngPreviewUrl(pngUrl);
      };

      image.onerror = () => {
        setPngPreviewUrl(null);
      };

      image.src = dataUrl;
    } catch {
      setPreviewUrl(null);
      setPngPreviewUrl(null);
    }
  }, [
    companyName,
    sector,
    description,
    target,
    price,
    phone,
    address,
    slogan,
    colors,
    visualType,
    template,
    selectedImageUrl,
    selectedVisual,
  ]);

  function svgToDataUrl(svg: string) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      svg
    )}`;
  }

  /*
   * GENERATION FINALE + CLOUDINARY
   */

  async function generateVisual() {
    setError("");

    if (!companyName.trim()) {
      setError(
        "Indiquez le nom de votre entreprise."
      );
      return;
    }

    if (!sector.trim()) {
      setError(
        "Indiquez votre secteur d'activité."
      );
      return;
    }

    if (!description.trim()) {
      setError(
        "Décrivez brièvement votre produit ou service."
      );
      return;
    }

    try {
      setGenerating(true);

      const svg = buildSvg();
      const dataUrl = svgToDataUrl(svg);

      const image = new Image();

      image.onload = async () => {
        try {
          const canvas =
            document.createElement("canvas");

          canvas.width =
            selectedVisual.width;

          canvas.height =
            selectedVisual.height;

          const context =
            canvas.getContext("2d");

          if (!context) {
            throw new Error(
              "Impossible de créer le visuel."
            );
          }

          context.fillStyle = "#ffffff";

          context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
          );

          context.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
          );

          const blob =
            await new Promise<Blob | null>(
              (resolve) =>
                canvas.toBlob(
                  resolve,
                  "image/png",
                  1
                )
            );

          if (!blob) {
            throw new Error(
              "Impossible de générer le PNG."
            );
          }

          const formData =
            new FormData();

          formData.append(
            "file",
            blob,
            `idify-${visualType}-${template}-${Date.now()}.png`
          );

          formData.append(
            "prompt",
            JSON.stringify({
              type: visualType,
              template,
              companyName,
              sector,
              description,
              target,
              price,
              phone,
              address,
              slogan,
              colors,
              hasImage:
                Boolean(selectedImageUrl),
            })
          );

          const response =
            await fetch(
              `/api/projects/${projectId}/images`,
              {
                method: "POST",
                body: formData,
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.error ||
                "Impossible d'enregistrer le visuel."
            );
          }

          await loadImages();

          setGenerating(false);
        } catch (err) {
          setGenerating(false);

          setError(
            err instanceof Error
              ? err.message
              : "Impossible d'enregistrer le visuel."
          );
        }
      };

      image.onerror = () => {
        setGenerating(false);

        setError(
          "Impossible de charger le visuel."
        );
      };

      image.src = dataUrl;
    } catch (err) {
      setGenerating(false);

      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );
    }
  }

  /*
   * TELECHARGEMENT PNG
   */

  function downloadPreview() {
    if (!pngPreviewUrl) {
      setError(
        "Le visuel n'est pas encore prêt."
      );
      return;
    }

    const link =
      document.createElement("a");

    link.href = pngPreviewUrl;

    link.download =
      `idify-${visualType}-${template}.png`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  return (
    <section
      id="identite"
      className="mt-8 scroll-mt-8 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8"
    >
      {/* HEADER */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <span>06</span>
            <span>Studio Visuel IDIFY</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-[#111]">
            Créez un visuel professionnel.
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">
            Concevez votre visuel directement dans IDIFY
            et visualisez chaque modification instantanément.
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-[#f7f7f4] px-4 py-3 text-sm text-black/60">
          <span className="font-semibold text-black">
            {images.length}
          </span>{" "}
          visuel{images.length > 1 ? "s" : ""} enregistré
          {images.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* FORMAT */}

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-[#111]">
          1. Choisissez votre format
        </h3>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {visualTypes.map((visual) => {
            const active =
              visual.id === visualType;

            return (
              <button
                key={visual.id}
                type="button"
                onClick={() =>
                  setVisualType(visual.id)
                }
                className={`rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-black bg-[#111] text-white"
                    : "border-black/10 bg-[#fafaf8] text-[#111] hover:border-black/25"
                }`}
              >
                <div className="mb-3 text-xl">
                  {visual.icon}
                </div>

                <p className="text-sm font-semibold">
                  {visual.title}
                </p>

                <p
                  className={`mt-1 text-xs leading-5 ${
                    active
                      ? "text-white/60"
                      : "text-black/45"
                  }`}
                >
                  {visual.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* TEMPLATE */}

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-[#111]">
          2. Choisissez votre template
        </h3>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((item) => {
            const active =
              item.id === template;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setTemplate(item.id)
                }
                className={`rounded-2xl border p-5 text-left transition ${
                  active
                    ? "border-amber-500 bg-amber-50"
                    : "border-black/10 bg-[#fafaf8] hover:border-black/25"
                }`}
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                    active
                      ? "bg-[#111] text-white"
                      : "bg-white text-[#111]"
                  }`}
                >
                  {item.icon}
                </div>

                <p className="text-sm font-semibold text-[#111]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-black/45">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        {/* FORMULAIRE */}

        <div>
          <h3 className="mb-4 text-lg font-semibold text-[#111]">
            3. Informations de votre entreprise
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#111]">
                Nom de l'entreprise *
              </label>

              <input
                value={companyName}
                onChange={(event) =>
                  setCompanyName(
                    event.target.value
                  )
                }
                placeholder="Ex. Jus Naturel Lomé"
                className="w-full rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 text-sm outline-none transition focus:border-black/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#111]">
                Secteur d'activité *
              </label>

              <input
                value={sector}
                onChange={(event) =>
                  setSector(event.target.value)
                }
                placeholder="Ex. Jus naturels"
                className="w-full rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 text-sm outline-none transition focus:border-black/30"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[#111]">
              Produit ou service *
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              rows={4}
              placeholder="Décrivez ce que vous proposez..."
              className="w-full resize-none rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 text-sm outline-none transition focus:border-black/30"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[#111]">
              Clientèle cible
            </label>

            <input
              value={target}
              onChange={(event) =>
                setTarget(event.target.value)
              }
              placeholder="Ex. Étudiants, familles..."
              className="w-full rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 text-sm outline-none transition focus:border-black/30"
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#111]">
                Prix / offre
              </label>

              <input
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                placeholder="Ex. 1 500 FCFA"
                className="w-full rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 text-sm outline-none focus:border-black/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#111]">
                Téléphone / WhatsApp
              </label>

              <input
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="Ex. +228 XX XX XX XX"
                className="w-full rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 text-sm outline-none focus:border-black/30"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[#111]">
              Adresse
            </label>

            <input
              value={address}
              onChange={(event) =>
                setAddress(event.target.value)
              }
              placeholder="Ex. Lomé, Togo"
              className="w-full rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 text-sm outline-none focus:border-black/30"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[#111]">
              Slogan
            </label>

            <input
              value={slogan}
              onChange={(event) =>
                setSlogan(event.target.value)
              }
              placeholder="Ex. Le goût naturel, chaque jour."
              className="w-full rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 text-sm outline-none focus:border-black/30"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[#111]">
              Couleur principale
            </label>

            <div className="flex gap-2">
              <input
                type="color"
                value={colors}
                onChange={(event) =>
                  setColors(event.target.value)
                }
                className="h-11 w-14 cursor-pointer rounded-xl border border-black/10 bg-white p-1"
              />

              <input
                value={colors}
                onChange={(event) =>
                  setColors(event.target.value)
                }
                className="flex-1 rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 text-sm uppercase outline-none focus:border-black/30"
              />
            </div>
          </div>

          {/* IMAGE */}

          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-[#111]">
              4. Ajoutez votre image
            </h3>

            <label
              htmlFor={`visual-file-${projectId}`}
              className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-[#fafaf8] px-5 text-center transition hover:border-black/25 hover:bg-white"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-lg text-white">
                +
              </div>

              <span className="text-sm font-semibold text-[#111]">
                Importer votre logo ou votre photo
              </span>

              <span className="mt-1 text-xs text-black/45">
                PNG, JPG ou WEBP — 10 Mo maximum
              </span>

              {selectedFile && (
                <span className="mt-3 max-w-full truncate rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  {selectedFile.name}
                </span>
              )}

              {selectedImageUrl && (
                <img
                  src={selectedImageUrl}
                  alt="Image sélectionnée"
                  className="mt-4 h-24 w-24 rounded-2xl object-cover shadow-sm"
                />
              )}
            </label>

            <input
              id={`visual-file-${projectId}`}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={generateVisual}
            disabled={generating}
            className="mt-5 w-full rounded-2xl bg-[#111] px-5 py-4 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating
              ? "Enregistrement du PNG..."
              : "Créer et enregistrer mon visuel"}
          </button>
        </div>

        {/* APERCU */}

        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#111]">
                Aperçu en direct
              </h3>

              <p className="mt-1 text-sm text-black/50">
                Les modifications apparaissent automatiquement.
              </p>
            </div>

            <span className="rounded-full border border-black/10 bg-[#fafaf8] px-3 py-1.5 text-xs font-medium text-black/55">
              {selectedVisual.width} ×{" "}
              {selectedVisual.height}
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl border border-black/10 bg-[#f7f7f4] p-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Aperçu du visuel IDIFY"
                className="mx-auto max-h-[700px] w-full rounded-2xl object-contain shadow-sm"
              />
            ) : (
              <div className="flex min-h-[500px] items-center justify-center rounded-2xl bg-white">
                <p className="text-sm text-black/40">
                  Préparation de l'aperçu...
                </p>
              </div>
            )}
          </div>

          {previewUrl && (
            <button
              type="button"
              onClick={downloadPreview}
              disabled={!pngPreviewUrl}
              className="mt-4 w-full rounded-2xl border border-black/10 bg-white px-5 py-3.5 text-sm font-semibold text-[#111] transition hover:bg-[#fafaf8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Télécharger le PNG
            </button>
          )}

          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-[#111]">
              Bibliothèque
            </h3>

            {loadingImages ? (
              <div className="rounded-2xl border border-black/10 bg-[#fafaf8] p-8 text-center text-sm text-black/45">
                Chargement...
              </div>
            ) : images.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/10 bg-[#fafaf8] p-8 text-center">
                <p className="text-sm font-medium text-[#111]">
                  Aucun visuel enregistré
                </p>

                <p className="mt-1 text-xs text-black/45">
                  Vos créations IDIFY apparaîtront ici.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-2xl border border-black/10 bg-white"
                  >
                    <div className="aspect-square overflow-hidden bg-[#f7f7f4]">
                      <img
                        src={image.url}
                        alt={
                          image.prompt ||
                          "Visuel IDIFY"
                        }
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}