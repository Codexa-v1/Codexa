import React from "react";

export default function Spinner() {
  return (
    <section className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <section className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-700 border-opacity-70"></section>
    </section>
  );
}
