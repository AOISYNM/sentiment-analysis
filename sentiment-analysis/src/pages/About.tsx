const STEPS = [
  "Your text is lowercased and stripped of punctuation.",
  "Each word is converted to a number using the tokenizer from training.",
  "The sequence is padded or trimmed to 50 tokens.",
  "A bidirectional GRU network scores six emotions and returns the probabilities.",
];

const STACK = [
  { group: "Interface", items: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "React Router", "Zod"] },
  { group: "Model and API", items: ["TensorFlow", "Keras", "FastAPI", "Python"] },
  { group: "Hosting", items: ["Render"] },
];

export default function About() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <h1 className="font-serif text-5xl font-normal tracking-tight sm:text-7xl">About the model</h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
        The classifier is a bidirectional GRU trained on short English sentences. It picks one of six
        emotions: sadness, joy, love, anger, fear, or surprise.
      </p>

      <h2 className="mt-14 text-xl font-medium tracking-tight">What happens when you analyze text</h2>
      <ol className="mt-4 max-w-xl list-decimal space-y-2 pl-5 leading-relaxed text-slate-600 marker:text-slate-400">
        {STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <h2 className="mt-14 text-xl font-medium tracking-tight">Built with</h2>
      <div className="mt-4 space-y-4">
        {STACK.map(({ group, items }) => (
          <div key={group} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <p className="w-32 shrink-0 text-sm text-slate-500">{group}</p>
            <ul className="flex flex-wrap gap-2">
              {items.map((item) => (
                <li key={item} className="rounded-full bg-white px-3.5 py-1 text-sm text-slate-700 ring-1 ring-slate-900/5">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
