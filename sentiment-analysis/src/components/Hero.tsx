export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-10 pt-12 sm:pt-16">
      <h1 className="max-w-3xl text-balance font-serif text-5xl font-normal leading-[1.02] tracking-tight sm:text-7xl">
        What emotion is in your sentence?
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
        Write a sentence and the model reads it as joy, love, surprise, fear, anger, or sadness, with a
        confidence score for each.
      </p>
    </section>
  );
}
