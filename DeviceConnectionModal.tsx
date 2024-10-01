import React from "react";

interface DeviceConnectionModalProps {
  closeModal: () => void;
  visible: boolean;
  connectToPeripheral: (device: any) => void;
  devices: any[];
}

const DeviceConnectionModal: React.FC<DeviceConnectionModalProps> = ({
  closeModal,
  visible,
  connectToPeripheral,
  devices,
}) => {
  return visible ? (
    <div>
      {/* Modal implementation */}
      <button onClick={closeModal}>Close</button>
      {devices.length ? (
        devices.map((device) => (
          <div key={device.id} onClick={() => connectToPeripheral(device)}>
            {device.name}
          </div>
        ))
      ) : (
        <p>No devices found</p>
      )}
    </div>
  ) : null;
};

export default DeviceConnectionModal;
