import ContactForm from "@/components/ContactForm";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";

function page() {
  return (
    <>
      <Header />
      <Container>
        <main className="max-w-3xl mx-auto py-16 prose prose-neutral">
          <h1>Get In Touch</h1>
          <ContactForm />
        </main>
      </Container>
      <Footer />
    </>
  );
}

export default page;
