import React from "react";
import { GameConnection } from "../../../game";
import { VesselUpdate } from "../../../__protogen__/mass/api/updates_pb";
import { getContacts } from "../../../gettorz";
import { createContact } from "../../../gameActions";

interface ContactManagerProps {
  game: GameConnection;
  latestUpdate: VesselUpdate.AsObject;
}

const ContactManager = ({ game, latestUpdate }: ContactManagerProps) => {
  const contacts = getContacts(latestUpdate);
  contacts.map((contact) => 
    <option value={contact.designation}>{contact.designation}</option>;
  };
  return (
    <div className="contact-manager card">
      <select multiple={true}>
        {contacts.map((contact) =>
          <option value={contact.designation}>{contact.designation}</option>)}
      </select>
      <div>
        <button onClick={() => createContact()}>+ Create Contact</button>
      </div>
    </div>
  );
};

export default ContactManager;
