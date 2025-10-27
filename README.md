USE pinturas;

INSERT INTO Roles (nombre) VALUES ('admin');
INSERT INTO Roles (nombre) VALUES ('cajero');
INSERT INTO Roles (nombre) VALUES ('gerente');
INSERT INTO Roles (nombre) VALUES ('digitador');


INSERT INTO Sucursales (nombre, direccion, gps_lat, gps_lng, telefono, activa)
VALUES
('Pradera Chimaltenango', 'Dirección 1', 14.6349, -90.678, '123456789', true),
('Pradera Escuintla', 'Dirección 2', 13.935, -89.995, '987654321', true),
('Las Américas Mazatenango', 'Dirección 3', 14.607, -91.516, '456789123', true),
('La Trinidad Coatepeque', 'Dirección 4', 14.783, -91.563, '321654987', true),
('Pradera Xela', 'Dirección 5', 14.839, -91.514, '654321789', true),
('Centro Comercial Miraflores', 'Dirección 6', 14.6349, -90.678, '789123456', true);


SELECT * FROM Sucursales;