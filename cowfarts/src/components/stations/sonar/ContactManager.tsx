import React from "react";
import { GameConnection } from "../../../game";
import { VesselUpdate } from "../../../__protogen__/mass/api/updates_pb";
import { getContacts } from "../../../gettorz";
import {
  createContact,
  deleteContactList,
  mergeContacts,
} from "../../../gameActions";
import "./ContactManager.css";

interface ContactManagerProps {
  game: GameConnection;
  latestUpdate: VesselUpdate.AsObject;
  selectedContacts: string[];
  setSelectedContacts: (contacts: string[]) => void;
}

function shallowArrayCompare<T>(a: Array<T>, b: Array<T>): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function haveSameSelectedItems(
  oldProps: ContactManagerProps,
  newProps: ContactManagerProps
) {
  const oldContacts = getContacts(oldProps.latestUpdate).map(
    (contact) => contact.designation
  );
  const newContacts = getContacts(newProps.latestUpdate).map(
    (contact) => contact.designation
  );
  return (
    shallowArrayCompare(oldContacts, newContacts) &&
    shallowArrayCompare(oldProps.selectedContacts, newProps.selectedContacts)
  );
}

// ugh using React.memo so that the element won't get rewritten between click
// and change. This is really not the way code is meant to be
const ContactManager = React.memo(
  ({
    game,
    latestUpdate,
    selectedContacts,
    setSelectedContacts,
  }: ContactManagerProps) => {
    const contacts = getContacts(latestUpdate);

    const handleContactsChange = (
      event: React.ChangeEvent<HTMLSelectElement>
    ) => {
      const designations: string[] = [];
      const sO = event.target.selectedOptions;
      for (let i = 0; i < sO.length; i++) {
        designations.push(sO[i].value);
      }
      setSelectedContacts(designations);
    };

    const handleDeleteContacts = () => {
      if (
        confirm(
          `Are you sure you want to delete contacts: ${selectedContacts.join(
            ", "
          )}`
        )
      ) {
        setSelectedContacts([]);
        deleteContactList(game, selectedContacts);
      }
    };

    const handleMergeContacts = () => {
      if (
        confirm(
          `Are you sure you want to merge contacts: ${selectedContacts.join(
            ", "
          )}`
        )
      ) {
        setSelectedContacts([]);
        mergeContacts(game, selectedContacts);
      }
    };

    return (
      <div className="contact-manager card">
        Contact List
        <div className="contact-selector">
          <select
            multiple={true}
            onChange={handleContactsChange}
            size={10}
            value={selectedContacts}
          >
            {contacts.map((contact) => (
              <option value={contact.designation}>{contact.designation}</option>
            ))}
          </select>
          <div className="contact-control-buttons">
            <button onClick={() => createContact(game)}>
              + Create Contact
            </button>
            {selectedContacts.length > 0 && (
              <>
                <div className="dzi">
                  <hr />
                  ↓ Danger Zone ↓
                  <hr />
                </div>
                {selectedContacts.length > 0 && (
                  <button onClick={handleDeleteContacts}>
                    - Delete selected contact
                    {selectedContacts.length > 1 && "s"}
                  </button>
                )}
                {selectedContacts.length >= 2 && (
                  <button onClick={handleMergeContacts}>
                    ↢ Merge contacts
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
  haveSameSelectedItems
);

export default ContactManager;
