"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from "@heroui/react";
import { supabase } from "@/lib/supabaseClient";
import { useLayersStore } from "@/app/stores/useLayersStore";

function EmailCollectionModal() {
  const { loading: layersLoading } = useLayersStore();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!layersLoading) {
      const timer = setTimeout(() => {
        onOpen();
      }, 10000); // 10 seconds

      return () => clearTimeout(timer); // cleanup
    }
  }, [layersLoading, onOpen]);

  const handleSubmit = async () => {
    setError("");
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    const { error: supabaseError } = await supabase
      .from("email_subscriptions")
      .insert({ email });

    setLoading(false);

    if (supabaseError) {
      setError(supabaseError.message);
    } else {
      setSuccess(true);
      setEmail("");
    }
  };

  return (
    <>
      {/* <Button onPress={onOpen}>Join Waitlist</Button> */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Join Our Launch List 🚀
              </ModalHeader>
              <ModalBody>
                {success ? (
                  <p>Thanks! Your email has been successfully submitted.</p>
                ) : (
                  <>
                    <p>
                      Enter your email below to stay updated and get early
                      access:
                    </p>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-2"
                    />
                    {error && <p className="text-red-500 mt-1">{error}</p>}
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  disabled={loading}
                >
                  Close
                </Button>
                {!success && (
                  <Button
                    color="primary"
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default EmailCollectionModal;
