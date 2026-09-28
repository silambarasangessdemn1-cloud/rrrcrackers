"use client";



const SAFETY_GUIDELINES = [
  {
    number: "1. Open Space",
    text: "Always burst crackers in an open outdoor area away from dried leaves, vehicles, and structures.",
  },
  {
    number: "2. Water Bucket",
    text: "Keep a bucket of clean water and sand nearby for emergency extinguishing and cooling sparkler wires.",
  },
  {
    number: "3. Adult Supervision",
    text: "Ensure children always play under adult supervision with age-appropriate crackers like sparklers.",
  },
  {
    number: "4. Cotton Clothes",
    text: "Wear fitted cotton clothing and footwear; strictly avoid loose synthetic or silk garments while firing.",
  },
];

export default function SafetyGuidelines() {
  return (
    <section className="w-full bg-cream py-custom-24 section">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-custom-16">
        <div className="flex items-center gap-custom-8">
          <h2 className="text-h4 font-heading font-bold text-text-primary">
            Diwali Safety Guidelines & Precautions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-custom-12 md:gap-custom-16">
          {SAFETY_GUIDELINES.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-border-amber rounded-custom-16 p-custom-16 md:p-custom-20 flex flex-col gap-custom-8 shadow-xs"
            >
              <h3 className="text-body font-heading font-bold text-primary-600">
                {item.number}
              </h3>
              <p className="text-caption text-text-secondary">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
