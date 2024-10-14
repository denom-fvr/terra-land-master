"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/initSupabase";
import { Button } from "../common/Button";
import Table from "../tables/Table";
import Modal from "../common/Modal";
import FormInput from "../forms/FormInput";
import SHA256 from "crypto-js/sha256"; // Import the hashing function

interface Document {
  id: number;
  created_at: string;
  full_name: string | null;
  serial_number: string | null;
  national_id_number: string | null;
  latitudinal_location: string | null;
  longitudinal_location: string | null;
  hash_key: string | null; // Add hash_key to the Document interface
}

export default function DataTableWithForm() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [formInputData, setFormInputData] = useState({
    full_name: "",
    serial_number: "",
    national_id_number: "",
    latitudinal_location: "",
    longitudinal_location: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setFormInputData({
      full_name: "",
      serial_number: "",
      national_id_number: "",
      latitudinal_location: "",
      longitudinal_location: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInputData({
      ...formInputData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchDocuments = async () => {
    const { data, error } = await supabase.from('land-documents').select('*');
    if (error) {
      console.error("Error fetching documents:", error);
    } else {
      setDocuments(data);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const addDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { full_name, serial_number, national_id_number, latitudinal_location, longitudinal_location } = formInputData;

    // Generate the hash key
    const hashKey = SHA256(
      `${full_name}${serial_number}${national_id_number}${latitudinal_location}${longitudinal_location}`
    ).toString();

    const { error } = await supabase
      .from('land-documents')
      .insert(
        [
          {
            full_name: full_name,
            serial_number: serial_number,
            national_id_number: national_id_number,
            latitudinal_location: latitudinal_location,
            longitudinal_location: longitudinal_location,
            hash_key: hashKey, // Include the hash key in the insert
          }
        ]
      );

    if (error) {
      console.error("Error adding document:", error);
    } else {
      // Optionally fetch documents again to refresh the list
      fetchDocuments();
    }

    setIsModalOpen(false);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormInputData((prevData) => ({
            ...prevData,
            latitudinal_location: position.coords.latitude.toString(),
            longitudinal_location: position.coords.longitude.toString(),
          }));
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <>
      <Table tableData={documents} />
      <div className="flex items-center justify-center pt-6">
        <Button onClick={toggleModal}>Register Your Land</Button>
      </div>
      {isModalOpen && (
        <Modal onClose={toggleModal}>
          <FormInput
            formInputData={formInputData}
            handleChange={handleChange}
            handleSubmit={addDocument}
            getLocation={getLocation}
          />
        </Modal>
      )}
    </>
  );
}
