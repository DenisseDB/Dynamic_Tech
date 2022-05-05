-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Servidor: mysql-dynamictech.alwaysdata.net
-- Tiempo de generación: 05-05-2022 a las 04:00:30
-- Versión del servidor: 10.6.5-MariaDB
-- Versión de PHP: 7.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dynamictech_bd_feedback2`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `agregarEmpleado` (IN `U_nombre` VARCHAR(100) CHARSET utf16, IN `U_apellidoP` VARCHAR(100) CHARSET utf16, IN `U_apellidoM` VARCHAR(100) CHARSET utf16, IN `U_correo` VARCHAR(200) CHARSET utf16, IN `U_contraseña` VARCHAR(200) CHARSET utf16, IN `U_idEquipo` INT, IN `U_fotoPerfil` VARCHAR(400) CHARSET utf16, IN `U_idRol` INT, IN `U_nivelCraft` FLOAT, IN `U_nivelPeople` FLOAT, IN `U_nivelBusiness` FLOAT)   BEGIN

INSERT INTO `empleado` (`idEmpleado`, `nombre`, `apellidoP`, `apellidoM`, `correo`, `contrasena`, `idEquipo`, `fotoPerfil`) VALUES (NULL, U_nombre, U_apellidoP, U_apellidoM, U_correo, U_contraseña, U_idEquipo, U_fotoPerfil);

INSERT INTO rolempleado VALUES (LAST_INSERT_ID(),U_idRol, CURRENT_TIMESTAMP());

INSERT INTO dimempleado_actual VALUES 
(LAST_INSERT_ID(),1, U_nivelCraft,
 CURRENT_TIMESTAMP()),
(LAST_INSERT_ID(),2, U_nivelPeople, CURRENT_TIMESTAMP()),
(LAST_INSERT_ID(),3, U_nivelBusiness, CURRENT_TIMESTAMP());

INSERT INTO dimempleado VALUES 
(LAST_INSERT_ID(),1, U_nivelCraft,
 CURRENT_TIMESTAMP()),
(LAST_INSERT_ID(),2, U_nivelPeople, CURRENT_TIMESTAMP()),
(LAST_INSERT_ID(),3, U_nivelBusiness, CURRENT_TIMESTAMP());


END$$

CREATE DEFINER=`root`@`%` PROCEDURE `modificarEmpleado` (IN `U_nombre` VARCHAR(100), IN `U_apellidoP` VARCHAR(100), IN `U_apellidoM` VARCHAR(100), IN `U_correo` VARCHAR(400), IN `U_contrasena` VARCHAR(400), IN `U_idEquipo` INT, IN `U_idEmpleado` INT, IN `U_idRol` INT, IN `U_nivelCraft` FLOAT, IN `U_nivelPeople` FLOAT, IN `U_nivelBusiness` FLOAT, IN `U_fotoPerfil` VARCHAR(1000))   BEGIN

UPDATE empleado SET nombre = U_nombre, apellidoP = U_apellidoP, apellidoM = U_apellidoM, correo = U_correo, contrasena = U_contrasena,idEquipo = U_idEquipo, fotoPerfil = U_fotoPerfil WHERE idEmpleado = U_idEmpleado;

IF(SELECT idRol from rolempleado WHERE idEmpleado = 1)!= U_idRol
THEN

 UPDATE rolempleado SET idRol = U_idRol WHERE idEmpleado = U_idEmpleado;
 
END IF;

/*Para update de nivelCraft*/
IF (SELECT nivelE from dimempleado_actual WHERE idEmpleado = U_idEmpleado AND idDimension = 1) != U_nivelCraft 
THEN

    UPDATE dimempleado_actual SET nivelE = U_nivelCraft, fecha = CURRENT_TIMESTAMP() WHERE idEmpleado = U_idEmpleado AND idDimension = 1;
    
    INSERT INTO dimempleado VALUES (U_idEmpleado,1, U_nivelCraft,
 CURRENT_TIMESTAMP());

END IF;

/*Para update de nivelPeople*/
IF (SELECT nivelE from dimempleado_actual WHERE idEmpleado = U_idEmpleado AND idDimension = 2) != U_nivelPeople
THEN

    UPDATE dimempleado_actual SET nivelE = U_nivelPeople, fecha = CURRENT_TIMESTAMP() WHERE idEmpleado = U_idEmpleado AND idDimension = 2;
    
    INSERT INTO dimempleado VALUES (U_idEmpleado,2, U_nivelPeople, CURRENT_TIMESTAMP());
    
 END IF;
 
 
 /*Para update de nivelBusiness*/
IF (SELECT nivelE from dimempleado_actual WHERE idEmpleado = U_idEmpleado AND idDimension = 3) != U_nivelBusiness
THEN

    UPDATE dimempleado_actual SET nivelE = U_nivelBusiness, fecha = CURRENT_TIMESTAMP() WHERE idEmpleado = U_idEmpleado AND idDimension = 3;
    
    INSERT INTO dimempleado VALUES (U_idEmpleado,3, U_nivelBusiness, CURRENT_TIMESTAMP());
    
 END IF;


END$$

CREATE DEFINER=`root`@`%` PROCEDURE `registrarFeedback` (IN `U_idEvaluado` INT, IN `U_idEvaluador` INT, IN `U_idPregunta` INT, IN `U_idPeriodo` INT, IN `U_respuesta` VARCHAR(40))   BEGIN 
INSERT INTO respondesolicita VALUES(U_idEvaluado,U_idEvaluador, U_idPregunta, U_idPeriodo,U_respuesta);

UPDATE retroalimentacion SET estatus = 1 WHERE idEvaluador = U_idEvaluador and idEvaluado = U_idEvaluado and idPeriodo = U_idPeriodo;
    
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignacionempleado`
--

CREATE TABLE `asignacionempleado` (
  `idMentor` int(11) NOT NULL,
  `idMentorado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `asignacionempleado`
--

INSERT INTO `asignacionempleado` (`idMentor`, `idMentorado`) VALUES
(1, 3),
(1, 4),
(1, 5),
(1, 13),
(1, 27),
(2, 8),
(2, 9),
(2, 10),
(7, 11),
(7, 12),
(7, 14),
(13, 15),
(13, 16),
(13, 28),
(24, 2),
(24, 6),
(26, 7),
(26, 18),
(26, 19),
(30, 20),
(30, 24),
(30, 33);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuestionario`
--

CREATE TABLE `cuestionario` (
  `idCuestionario` int(11) NOT NULL,
  `nombre` varchar(30) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT NULL,
  `nivelC` int(11) NOT NULL,
  `idDimension` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `cuestionario`
--

INSERT INTO `cuestionario` (`idCuestionario`, `nombre`, `fecha`, `nivelC`, `idDimension`) VALUES
(1, 'Craft1', '2020-02-13 23:00:00', 1, 1),
(2, 'Craft2', '2020-02-14 23:00:00', 2, 1),
(3, 'Craft3', '2020-02-15 23:00:00', 3, 1),
(4, 'Craft4', '2020-02-16 23:00:00', 4, 1),
(5, 'Craft5', '2020-02-17 23:00:00', 5, 1),
(6, 'People1', '2020-02-13 23:00:00', 1, 2),
(7, 'People2', '2020-02-14 23:00:00', 2, 2),
(8, 'People3', '2020-02-15 23:00:00', 3, 2),
(9, 'People4', '2020-02-16 23:00:00', 4, 2),
(10, 'People5', '2020-02-17 23:00:00', 5, 2),
(11, 'Business1', '2020-02-13 23:00:00', 1, 3),
(12, 'Business2', '2020-02-14 23:00:00', 2, 3),
(13, 'Business3', '2020-02-15 23:00:00', 3, 3),
(14, 'Business4', '2020-02-16 23:00:00', 4, 3),
(15, 'Business5', '2020-02-17 23:00:00', 5, 3),
(16, 'MiNuevoCuestionario', '2022-04-18 22:00:00', 1, 1),
(17, 'Craft1', '2022-04-29 15:25:45', 1, 1),
(18, 'Craft1', '2022-04-29 15:25:50', 1, 1),
(19, 'People3', '2022-04-29 15:27:05', 3, 2),
(20, 'Craft2', '2022-04-29 16:36:45', 2, 1),
(21, 'Craft4', '2022-05-03 05:26:03', 4, 1),
(22, 'Craft1', '2022-05-03 17:07:49', 1, 1),
(23, 'Craft1', '2022-05-03 17:58:27', 1, 1),
(24, 'Craft1', '2022-05-03 17:59:56', 1, 1),
(25, 'Craft1', '2022-05-03 18:08:20', 1, 1);

--
-- Disparadores `cuestionario`
--
DELIMITER $$
CREATE TRIGGER `editarCuestionario` AFTER INSERT ON `cuestionario` FOR EACH ROW UPDATE cuestionario_actual
SET idCuestionario = new.idCuestionario, fecha = new.fecha
WHERE nivelC = new.nivelC AND idDimension = new.idDimension
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuestionario_actual`
--

CREATE TABLE `cuestionario_actual` (
  `idCuestionario` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `nivelC` int(11) NOT NULL,
  `idDimension` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `cuestionario_actual`
--

INSERT INTO `cuestionario_actual` (`idCuestionario`, `nombre`, `fecha`, `nivelC`, `idDimension`) VALUES
(3, 'Craft3', '2020-02-16 05:00:00', 3, 1),
(5, 'Craft5', '2020-02-18 05:00:00', 5, 1),
(6, 'People1', '2020-02-14 05:00:00', 1, 2),
(7, 'People2', '2020-02-15 05:00:00', 2, 2),
(9, 'People4', '2020-02-17 05:00:00', 4, 2),
(10, 'People5', '2020-02-18 05:00:00', 5, 2),
(11, 'Business1', '2020-02-14 05:00:00', 1, 3),
(12, 'Business2', '2020-02-15 05:00:00', 2, 3),
(13, 'Business3', '2020-02-16 05:00:00', 3, 3),
(14, 'Business4', '2020-02-17 05:00:00', 4, 3),
(15, 'Business5', '2020-02-18 05:00:00', 5, 3),
(19, 'People3', '2022-04-29 15:27:05', 3, 2),
(20, 'Craft2', '2022-04-29 16:36:45', 2, 1),
(21, 'Craft4', '2022-05-03 05:26:03', 4, 1),
(25, 'Craft1', '2022-05-03 18:08:20', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dimempleado`
--

CREATE TABLE `dimempleado` (
  `idEmpleado` int(11) NOT NULL,
  `idDimension` int(11) NOT NULL,
  `nivelE` float DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `dimempleado`
--

INSERT INTO `dimempleado` (`idEmpleado`, `idDimension`, `nivelE`, `fecha`) VALUES
(1, 1, 3.1, '2019-12-31 23:00:00'),
(1, 1, 3.2, '2020-02-29 23:00:00'),
(1, 1, 3.4, '2020-05-31 22:00:00'),
(1, 1, 3.8, '2020-08-31 22:00:00'),
(1, 1, 3.3, '2022-05-03 16:54:15'),
(1, 1, 3.2, '2022-05-03 17:47:52'),
(1, 2, 3.1, '2019-12-31 23:00:00'),
(1, 2, 3.3, '2020-02-29 23:00:00'),
(1, 2, 3.3, '2020-05-31 22:00:00'),
(1, 2, 3.4, '2020-08-31 22:00:00'),
(1, 2, 4.1, '2022-05-03 17:46:33'),
(1, 2, 3.3, '2022-05-03 17:59:25'),
(1, 3, 2.2, '2019-12-31 23:00:00'),
(1, 3, 2.3, '2020-02-29 23:00:00'),
(1, 3, 2.5, '2020-05-31 22:00:00'),
(1, 3, 2.6, '2020-08-31 22:00:00'),
(1, 3, 3.1, '2022-05-03 17:45:54'),
(1, 3, 3.2, '2022-05-03 18:18:43'),
(2, 1, 2, '2020-01-14 23:00:00'),
(2, 1, 2.3, '2020-03-14 23:00:00'),
(2, 1, 2.3, '2020-06-14 22:00:00'),
(2, 1, 2.5, '2020-09-14 22:00:00'),
(2, 2, 2.3, '2020-01-14 23:00:00'),
(2, 2, 2.3, '2020-03-14 23:00:00'),
(2, 2, 2.4, '2020-06-14 22:00:00'),
(2, 2, 2.8, '2020-09-14 22:00:00'),
(2, 3, 4.2, '2020-01-14 23:00:00'),
(2, 3, 4.3, '2020-03-14 23:00:00'),
(2, 3, 4.5, '2020-06-14 22:00:00'),
(2, 3, 4.7, '2020-09-14 22:00:00'),
(3, 1, 3.3, '2020-02-22 23:00:00'),
(3, 1, 3.4, '2020-05-22 22:00:00'),
(3, 1, 3.5, '2020-08-22 22:00:00'),
(3, 1, 3.7, '2020-11-22 23:00:00'),
(3, 2, 2.3, '2020-02-22 23:00:00'),
(3, 2, 2.5, '2020-05-22 22:00:00'),
(3, 2, 2.5, '2020-08-22 22:00:00'),
(3, 2, 2.5, '2020-11-22 23:00:00'),
(3, 3, 2.1, '2020-02-22 23:00:00'),
(3, 3, 2.4, '2020-05-22 22:00:00'),
(3, 3, 2.6, '2020-08-22 22:00:00'),
(3, 3, 2.7, '2020-11-22 23:00:00'),
(4, 1, 4.2, '2020-02-03 23:00:00'),
(4, 2, 4.3, '2020-02-03 23:00:00'),
(4, 3, 2.3, '2020-02-03 23:00:00'),
(5, 1, 2.2, '2020-01-15 23:00:00'),
(5, 2, 1.3, '2020-01-15 23:00:00'),
(5, 3, 3.3, '2020-01-15 23:00:00'),
(6, 1, 1.3, '2020-02-26 23:00:00'),
(6, 2, 1.2, '2020-02-26 23:00:00'),
(6, 3, 2.2, '2020-02-26 23:00:00'),
(7, 1, 2.3, '2020-02-07 23:00:00'),
(7, 2, 2.3, '2020-02-07 23:00:00'),
(7, 3, 4.1, '2020-02-07 23:00:00'),
(8, 1, 4.1, '2020-02-17 23:00:00'),
(8, 2, 4.3, '2020-02-17 23:00:00'),
(8, 3, 4.1, '2020-02-17 23:00:00'),
(9, 1, 2.3, '2020-01-14 23:00:00'),
(9, 2, 1.2, '2020-01-14 23:00:00'),
(9, 3, 1.3, '2020-01-14 23:00:00'),
(10, 1, 3.3, '2020-03-10 23:00:00'),
(10, 2, 2.1, '2020-03-10 23:00:00'),
(10, 3, 1.2, '2020-03-10 23:00:00'),
(11, 1, 4.1, '2020-01-01 23:00:00'),
(11, 2, 4.1, '2020-02-01 23:00:00'),
(11, 3, 3.1, '2020-02-01 23:00:00'),
(12, 1, 3.3, '2020-02-10 23:00:00'),
(12, 2, 4.2, '2020-02-10 23:00:00'),
(12, 3, 2.2, '2020-02-10 23:00:00'),
(13, 1, 1.2, '2020-02-11 23:00:00'),
(13, 2, 1.3, '2020-02-11 23:00:00'),
(13, 3, 2.3, '2020-02-11 23:00:00'),
(14, 1, 1.2, '2020-01-24 23:00:00'),
(14, 2, 1.3, '2020-01-24 23:00:00'),
(14, 3, 3.2, '2020-01-24 23:00:00'),
(15, 1, 1.1, '2020-02-12 23:00:00'),
(15, 2, 2.2, '2020-02-12 23:00:00'),
(15, 3, 1.1, '2020-02-12 23:00:00'),
(16, 1, 1.3, '2020-03-01 23:00:00'),
(16, 2, 2.3, '2020-03-01 23:00:00'),
(16, 3, 1.1, '2020-03-01 23:00:00'),
(17, 1, 3.2, '2020-02-04 23:00:00'),
(17, 2, 4.1, '2020-02-04 23:00:00'),
(17, 3, 3.3, '2020-02-04 23:00:00'),
(18, 1, 4.3, '2020-01-02 23:00:00'),
(18, 2, 4.3, '2020-01-02 23:00:00'),
(18, 3, 4.3, '2020-01-02 23:00:00'),
(19, 1, 5.1, '2020-02-04 23:00:00'),
(19, 2, 4.2, '2020-02-04 23:00:00'),
(19, 3, 2.2, '2020-02-04 23:00:00'),
(20, 1, 5.3, '2020-01-10 23:00:00'),
(20, 2, 1.2, '2020-01-10 23:00:00'),
(20, 3, 5.3, '2020-01-10 23:00:00'),
(21, 1, 2.2, '2020-03-07 23:00:00'),
(21, 2, 5.1, '2020-03-07 23:00:00'),
(21, 3, 4.3, '2020-03-07 23:00:00'),
(23, 1, 3.3, '2022-04-07 22:00:00'),
(23, 2, 3.1, '2022-04-07 22:00:00'),
(23, 3, 3.1, '2022-04-07 22:00:00'),
(24, 1, 2.3, '2022-04-19 22:00:00'),
(24, 2, 1.3, '2022-04-19 22:00:00'),
(24, 3, 1.3, '2022-04-19 22:00:00'),
(25, 1, 3.1, '2022-04-19 22:00:00'),
(25, 2, 2.2, '2022-04-19 22:00:00'),
(25, 3, 2.2, '2022-04-19 22:00:00'),
(26, 1, 4.1, '2022-04-20 22:00:00'),
(26, 2, 4.3, '2022-04-20 22:00:00'),
(26, 3, 4.3, '2022-04-20 22:00:00'),
(27, 1, 3.3, '2022-04-20 22:00:00'),
(27, 1, 3.1, '2022-04-22 21:24:44'),
(27, 2, 1.3, '2022-04-20 22:00:00'),
(27, 2, 2.1, '2022-04-22 21:24:44'),
(27, 3, 1.3, '2022-04-20 22:00:00'),
(27, 3, 1.1, '2022-04-22 21:24:44'),
(28, 1, 3.2, '2022-04-20 22:00:00'),
(28, 2, 2.3, '2022-04-20 22:00:00'),
(28, 3, 2.3, '2022-04-20 22:00:00'),
(29, 1, 2.3, '2022-04-25 21:09:33'),
(29, 2, 2.3, '2022-04-25 21:09:33'),
(29, 3, 2.3, '2022-04-25 21:09:33'),
(30, 1, 3.1, '2022-04-25 21:11:28'),
(30, 2, 2.3, '2022-04-25 21:11:28'),
(30, 3, 2.3, '2022-04-25 21:11:28'),
(31, 1, 2.3, '2022-04-26 01:26:13'),
(31, 2, 2.3, '2022-04-26 01:26:13'),
(31, 3, 2.3, '2022-04-26 01:26:13'),
(32, 1, 1.2, '2022-04-30 22:28:53'),
(32, 2, 1.3, '2022-04-30 22:28:53'),
(32, 3, 1.3, '2022-04-30 22:28:53'),
(33, 1, 2.2, '2022-04-30 22:37:02'),
(33, 1, 3.1, '2022-04-30 22:38:19'),
(33, 2, 2.3, '2022-04-30 22:37:02'),
(33, 3, 2.3, '2022-04-30 22:37:02'),
(34, 1, 1.3, '2022-05-03 17:04:41'),
(34, 2, 2.2, '2022-05-03 17:04:41'),
(34, 3, 2.2, '2022-05-03 17:04:41'),
(35, 1, 3.1, '2022-05-03 17:09:26'),
(35, 2, 3.1, '2022-05-03 17:09:26'),
(35, 3, 2.3, '2022-05-03 17:09:26'),
(36, 1, 1.1, '2022-05-03 17:10:12'),
(36, 2, 1.2, '2022-05-03 17:10:12'),
(36, 3, 1.3, '2022-05-03 17:10:12'),
(37, 1, 3.2, '2022-05-04 18:34:06'),
(37, 2, 3.1, '2022-05-04 18:34:06'),
(37, 3, 1.3, '2022-05-04 18:34:06'),
(38, 1, 3.1, '2022-05-04 18:38:24'),
(38, 2, 3.1, '2022-05-04 18:38:24'),
(38, 3, 3.1, '2022-05-04 18:38:24'),
(39, 1, 3.2, '2022-05-04 18:41:14'),
(39, 2, 3.1, '2022-05-04 18:41:14'),
(39, 3, 2.1, '2022-05-04 18:41:14'),
(40, 1, 4.1, '2022-05-04 19:18:45'),
(40, 1, 4.3, '2022-05-04 20:12:11'),
(40, 2, 3.1, '2022-05-04 19:18:45'),
(40, 3, 2.3, '2022-05-04 19:18:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dimempleado_actual`
--

CREATE TABLE `dimempleado_actual` (
  `idEmpleado` int(11) NOT NULL,
  `idDimension` int(11) NOT NULL,
  `nivelE` float DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `dimempleado_actual`
--

INSERT INTO `dimempleado_actual` (`idEmpleado`, `idDimension`, `nivelE`, `fecha`) VALUES
(1, 1, 3.2, '2022-05-03 17:47:52'),
(1, 2, 3.3, '2022-05-03 17:59:25'),
(1, 3, 3.2, '2022-05-03 18:18:43'),
(2, 1, 2.5, '2020-09-14 22:00:00'),
(2, 2, 2.8, '2020-09-14 22:00:00'),
(2, 3, 4.7, '2020-09-14 22:00:00'),
(3, 1, 3.7, '2020-11-22 23:00:00'),
(3, 2, 2.5, '2020-11-22 23:00:00'),
(3, 3, 2.7, '2020-11-22 23:00:00'),
(4, 1, 4.2, '2020-02-03 23:00:00'),
(4, 2, 4.3, '2020-02-03 23:00:00'),
(4, 3, 2.3, '2020-02-03 23:00:00'),
(5, 1, 2.2, '2020-01-15 23:00:00'),
(5, 2, 1.3, '2020-01-15 23:00:00'),
(5, 3, 3.3, '2020-01-15 23:00:00'),
(6, 1, 1.3, '2020-02-26 23:00:00'),
(6, 2, 1.2, '2020-02-26 23:00:00'),
(6, 3, 2.2, '2020-02-26 23:00:00'),
(7, 1, 2.3, '2020-02-07 23:00:00'),
(7, 2, 2.3, '2020-02-07 23:00:00'),
(7, 3, 4.1, '2020-02-07 23:00:00'),
(8, 1, 4.1, '2020-02-17 23:00:00'),
(8, 2, 4.3, '2020-02-17 23:00:00'),
(8, 3, 4.1, '2020-02-17 23:00:00'),
(9, 1, 2.3, '2020-01-14 23:00:00'),
(9, 2, 1.2, '2020-01-14 23:00:00'),
(9, 3, 1.3, '2020-01-14 23:00:00'),
(10, 1, 3.3, '2020-03-10 23:00:00'),
(10, 2, 2.1, '2020-03-10 23:00:00'),
(10, 3, 1.2, '2020-03-10 23:00:00'),
(11, 1, 4.1, '2020-01-01 23:00:00'),
(11, 2, 4.1, '2020-02-01 23:00:00'),
(11, 3, 3.1, '2020-02-01 23:00:00'),
(12, 1, 3.3, '2020-02-10 23:00:00'),
(12, 2, 4.2, '2020-02-10 23:00:00'),
(12, 3, 2.2, '2020-02-10 23:00:00'),
(13, 1, 1.2, '2020-02-11 23:00:00'),
(13, 2, 1.3, '2020-02-11 23:00:00'),
(13, 3, 2.3, '2020-02-11 23:00:00'),
(14, 1, 1.2, '2020-01-24 23:00:00'),
(14, 2, 1.3, '2020-01-24 23:00:00'),
(14, 3, 3.2, '2020-01-24 23:00:00'),
(15, 1, 1.1, '2020-02-12 23:00:00'),
(15, 2, 2.2, '2020-02-12 23:00:00'),
(15, 3, 1.1, '2020-02-12 23:00:00'),
(16, 1, 1.3, '2020-03-01 23:00:00'),
(16, 2, 2.3, '2020-03-01 23:00:00'),
(16, 3, 1.1, '2020-03-01 23:00:00'),
(17, 1, 3.2, '2020-02-04 23:00:00'),
(17, 2, 4.1, '2020-02-04 23:00:00'),
(17, 3, 3.3, '2020-02-04 23:00:00'),
(18, 1, 4.3, '2020-01-02 23:00:00'),
(18, 2, 4.3, '2020-01-02 23:00:00'),
(18, 3, 4.3, '2020-01-02 23:00:00'),
(19, 1, 5.1, '2020-02-04 23:00:00'),
(19, 2, 4.2, '2020-02-04 23:00:00'),
(19, 3, 2.2, '2020-02-04 23:00:00'),
(20, 1, 5.3, '2020-01-10 23:00:00'),
(20, 2, 1.2, '2020-01-10 23:00:00'),
(20, 3, 5.3, '2020-01-10 23:00:00'),
(21, 1, 2.2, '2020-03-07 23:00:00'),
(21, 2, 5.1, '2020-03-07 23:00:00'),
(21, 3, 4.3, '2020-03-07 23:00:00'),
(23, 1, 3.1, '2022-04-22 18:28:40'),
(23, 2, 3.2, '2022-04-22 18:28:40'),
(23, 3, 3.3, '2022-04-22 18:28:40'),
(24, 1, 2.3, '2022-04-19 22:00:00'),
(24, 2, 1.3, '2022-04-19 22:00:00'),
(24, 3, 1.3, '2022-04-19 22:00:00'),
(25, 1, 3.1, '2022-04-20 00:41:15'),
(25, 2, 2.2, '2022-04-20 00:41:15'),
(25, 3, 2.2, '2022-04-20 00:41:15'),
(26, 1, 4.1, '2022-04-21 16:58:16'),
(26, 2, 4.3, '2022-04-21 16:58:16'),
(26, 3, 4.3, '2022-04-21 16:58:16'),
(27, 1, 3.1, '2022-04-22 21:24:44'),
(27, 2, 2.1, '2022-04-22 21:24:44'),
(27, 3, 1.1, '2022-04-22 21:24:44'),
(28, 1, 3.2, '2022-04-21 17:02:40'),
(28, 2, 2.3, '2022-04-21 17:02:40'),
(28, 3, 2.3, '2022-04-21 17:02:40'),
(29, 1, 2.3, '2022-04-25 21:09:33'),
(29, 2, 2.3, '2022-04-25 21:09:33'),
(29, 3, 2.3, '2022-04-25 21:09:33'),
(30, 1, 3.1, '2022-04-25 21:11:28'),
(30, 2, 2.3, '2022-04-25 21:11:28'),
(30, 3, 2.3, '2022-04-25 21:11:28'),
(31, 1, 2.3, '2022-04-26 01:26:13'),
(31, 2, 2.3, '2022-04-26 01:26:13'),
(31, 3, 2.3, '2022-04-26 01:26:13'),
(32, 1, 1.2, '2022-04-30 22:28:53'),
(32, 2, 1.3, '2022-04-30 22:28:53'),
(32, 3, 1.3, '2022-04-30 22:28:53'),
(33, 1, 3.1, '2022-04-30 22:38:19'),
(33, 2, 2.3, '2022-04-30 22:37:02'),
(33, 3, 2.3, '2022-04-30 22:37:02'),
(34, 1, 1.3, '2022-05-03 17:04:41'),
(34, 2, 2.2, '2022-05-03 17:04:41'),
(34, 3, 2.2, '2022-05-03 17:04:41'),
(35, 1, 3.1, '2022-05-03 17:09:26'),
(35, 2, 3.1, '2022-05-03 17:09:26'),
(35, 3, 2.3, '2022-05-03 17:09:26'),
(36, 1, 1.1, '2022-05-03 17:10:12'),
(36, 2, 1.2, '2022-05-03 17:10:12'),
(36, 3, 1.3, '2022-05-03 17:10:12'),
(37, 1, 3.2, '2022-05-04 18:34:06'),
(37, 2, 3.1, '2022-05-04 18:34:06'),
(37, 3, 1.3, '2022-05-04 18:34:06'),
(38, 1, 3.1, '2022-05-04 18:38:24'),
(38, 2, 3.1, '2022-05-04 18:38:24'),
(38, 3, 3.1, '2022-05-04 18:38:24'),
(39, 1, 3.2, '2022-05-04 18:41:14'),
(39, 2, 3.1, '2022-05-04 18:41:14'),
(39, 3, 2.1, '2022-05-04 18:41:14'),
(40, 1, 4.3, '2022-05-04 20:12:11'),
(40, 2, 3.1, '2022-05-04 19:18:45'),
(40, 3, 2.3, '2022-05-04 19:18:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dimension`
--

CREATE TABLE `dimension` (
  `idDimension` int(11) NOT NULL,
  `nombre` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `dimension`
--

INSERT INTO `dimension` (`idDimension`, `nombre`) VALUES
(1, 'Craft'),
(2, 'People & Mindsets'),
(3, 'Commercial & customer');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado`
--

CREATE TABLE `empleado` (
  `idEmpleado` int(11) NOT NULL,
  `nombre` varchar(30) DEFAULT NULL,
  `apellidoP` varchar(30) DEFAULT NULL,
  `apellidoM` varchar(30) DEFAULT NULL,
  `correo` varchar(30) DEFAULT NULL,
  `contrasena` varchar(100) DEFAULT NULL,
  `idEquipo` int(11) DEFAULT NULL,
  `fotoPerfil` varchar(400) DEFAULT NULL,
  `activo` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`idEmpleado`, `nombre`, `apellidoP`, `apellidoM`, `correo`, `contrasena`, `idEquipo`, `fotoPerfil`, `activo`) VALUES
(1, 'Bernardo', 'Laing', '', 'bernardoLaing@gmail.com', '$2a$12$r60qZNiwmbHglnSg.ywgO.H7YxYxAqBsHBWrtRdZlppHhp9wIZhg.', 1, '1651197116170-iconperfil.png', 1),
(2, 'Nicolás', 'Rodriguez', NULL, 'nicolasRdz@gmail.com', '$2a$12$jwItQLDnzyQBeM2pFVo01O.EARGJwxdI3gMoCgwX2eoIP6bwFt./y', 2, 'iconperfil.png', 1),
(3, 'Gabriel', 'Huitrón', NULL, 'gabrielHuitron@gmail.com', '$2a$12$daoeu2mHhK66vYNQaKsdqOsCOLnk7BmVhGBzUzUsn6a1meSv7iA4.', 3, 'iconperfil.png', 1),
(4, 'Alma', 'Patiño', NULL, 'almaPatino@gmail.com', '$2a$12$r60qZNiwmbHglnSg.ywgO.H7YxYxAqBsHBWrtRdZlppHhp9wIZhg.', 4, 'iconperfil.png', 1),
(5, 'Oriana', 'Gaterol', '', 'orianaGaterol@gmail.com', '$2a$12$0PyQn/fIbXjxVeFtIQbkyusSTbdb06kaBwiKhUO3m9iNN56aDpEyu', 5, 'iconperfil.png', 1),
(6, 'Felipe', 'Ossandon', NULL, 'felipeOssadon@gmail.com', NULL, 6, 'iconperfil.png', 1),
(7, 'Carlos', 'Rios', NULL, 'carlosRios@gmail.com', NULL, 7, 'iconperfil.png', 1),
(8, 'Diego', 'Avendaño', NULL, 'diegoAvedaño@gmail.com', NULL, 3, 'iconperfil.png', 1),
(9, 'Valter', 'Nuñez', NULL, 'valterNuñez@gmail.com', NULL, 1, 'iconperfil.png', 1),
(10, 'Pedro', 'Rodríguez', NULL, 'pedroRdz@gmail.com', NULL, 1, 'iconperfil.png', 1),
(11, 'Natalia', 'Rodriguez', NULL, 'nataliaRdz@gmail.com', NULL, 1, 'iconperfil.png', 1),
(12, 'Edgar', 'Santana', NULL, 'edgarSantana@gmail.com', NULL, 6, 'iconperfil.png', 1),
(13, 'Cristhian', 'Abarca', NULL, 'cristhianAbarca@gmail.com', NULL, 7, 'iconperfil.png', 1),
(14, 'Dalton', 'Nuñez', NULL, 'daltonNuñez@gmail.com', NULL, 7, 'iconperfil.png', 1),
(15, 'Kevin', 'Rojas', '', 'kevinRojas@gmail.com', '$2a$12$kb4G1nDoZ0joT5HHf5cuv.dmcUx2XTvU8yKSJnDFFXa/EfluJCAYG', 6, 'iconperfil.png', 1),
(16, 'Iván', 'Celis', NULL, 'ivanCelis@gmail.com', '', 7, 'iconperfil.png', 1),
(17, 'Julio', 'De Alba', NULL, 'julioDeAlba@gmail.com', NULL, 2, 'iconperfil.png', 1),
(18, 'Aldo', 'Rivera', NULL, 'aldoRivera@gmail.com', NULL, 3, 'iconperfil.png', 1),
(19, 'Erick', 'Samaniego', NULL, 'erickSamaniego@gmail.com', NULL, 2, 'iconperfil.png', 1),
(20, 'Matías', 'Becerra', 'Contreras', 'matiasBecerra@gmail.com', '$2a$12$daoeu2mHhK66vYNQaKsdqOsCOLnk7BmVhGBzUzUsn6a1meSv7iA4.', 6, 'iconperfil.png', 1),
(21, 'Abraham', 'Febres', NULL, 'abrahamFebres@gmail.com', NULL, 6, 'iconperfil.png', 0),
(23, 'Karen', 'López', NULL, 'anakaren@example.com', NULL, 5, 'iconperfil.png', 0),
(24, 'Enrique', 'Vela', 'Vista', 'enriqueVela@gmail.com', '$2a$12$v5PnrJw4RAkRZXp0vNTQfuN', 2, '1650413560784-enrique.jpg', 1),
(25, 'Greta', 'Alivi', 'Torres', 'gretaAlivi@gmail.com', '$2a$12$sK9YcWXXIQ.PBXOKBjDp/.X', 7, '1650415270352-greta.jpg', 0),
(26, 'Jordana', 'Betancourt', 'Menchaca', 'jordanabm2@gmail.com', '$2a$12$nmN.0.vlVh/1zu4oEFDM1OXmfGiLRbYuUmNI8LLlEbG62EvTZS.Ly', 6, '1650560289697-jordywhats.jpg', 1),
(27, 'Ariana', 'Grande', 'Butera', 'arianaGrande@example.com', '$2a$12$yVPz7IWFNriaPSY2ZvrhouN', 4, '1650560422655-icon.png', 1),
(28, 'Bernardo', 'Quintana', 'Flores', 'bernardoQuintana@gmail.com', '$2a$12$jjotF5eRDDfy8V980VwsteX', 6, '1650560554043-icon.png', 1),
(29, 'Jordana', 'Gómez', 'Betancourt', 'hola@example.com', '$2a$12$h89ovwVG3It90NNbhtiyLOGfL7k.zTMkQN8B1puarmWxNqBHGCbGC', 4, 'iconperfil.png', 1),
(30, 'Paulina', 'del Campo', 'Cardona', 'PauDelCampo@example.com', '$2a$12$vTfKHnlvvgK2fYr3xptVQuV901Y0iR7xBir/KHi0qtE6PjVJ4t48O', 3, '1650935782841-pau.jpg', 1),
(31, 'Federico', 'Lisboa', '', 'federicoLisboa@example.com', '$2a$12$SNVFJFS0fs.0uKcq11Q/t.AYz99Km89EwtdRtsvdjbuENdRGT0GEW', 7, 'iconperfil.png', 0),
(32, 'Juan Pablo', 'de la Garza', 'García', 'juanPabloGarza@gmail.com', '$2a$12$hW29oxS4DI.3DEAkOGCE3eAE3v55XVYXtpmUYZEnJmkICUpRYAx0m', 1, '1651357732754-2680702.jpeg', 1),
(33, 'Federico', 'Lisboa', 'Méndez', 'federicoLisboa@gmail.com', '$2a$12$r07J5jpNzPUyn4EDAA7eue/qidO54cYGaYA.9hLkHYgcE9Fv1Ev36', 1, '1651358298385-1250689.png', 1),
(34, 'Rodrigo', 'Carrizales', '', 'rodrigo@example.com', '$2a$12$ALCbfrjzzt2XGOKrCLGmQeMQy86enB365YdaRvQiO9sGWHum6wEDi', 1, 'iconperfil.png', 0),
(35, 'Rodrigo', 'Gómez', '', 'rodrigo@example.com', '$2a$12$AQqCMt3cLsmrBf2DpVLMY.lnZVq3ejztFt5xob8gGMZv1IBdVW9Fe', 6, 'iconperfil.png', 0),
(36, 'Rodrigo', 'Gómez', '', 'rodrigo@example.com', '$2a$12$rQwJO08ckEXXAnf6u1GoUeKnlYd.NAZd9diPzqHD8xD7JyM4WH7/S', 1, 'iconperfil.png', 0),
(37, 'Eduardo', 'López', 'Villaseñor', 'eduardo@example.com', '$2a$12$pHsFkjhuhbgb.KcHZ3QT.eM9L2bXHU5sgP1XjdD8lLz.QCkPp61Q2', 1, 'iconperfil.png', 1),
(38, 'Alfonso', 'Huerta', '', 'alfonso@example.com', '$2a$12$qtqh0VnfiJNC9NdCDiEzJukB7Q6lPeuqCyobaZtvWNaRhqRD8w0VG', 1, 'iconperfil.png', 1),
(39, 'Hola', 'Ejemplo', '', 'hola@example.com', '$2a$12$k2c2FM5FF0TJEyjFo0ik7uxFEXzSawpCvaFrNxmB68bs3GprcFJLG', 1, 'iconperfil.png', 0),
(40, 'Javier', 'Hernández', 'Flores', 'javiH123@example.com', '$2a$12$BvrMGCZTYHm4FDvyUE2vg.IVfEH1jwEDM94j6Znqsl/KMZkBTveiK', 2, '1651695131682-gato2.png', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipo`
--

CREATE TABLE `equipo` (
  `idEquipo` int(11) NOT NULL,
  `nombre` varchar(30) DEFAULT NULL,
  `descripcion` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `equipo`
--

INSERT INTO `equipo` (`idEquipo`, `nombre`, `descripcion`) VALUES
(1, 'ZeCore Client', NULL),
(2, 'ZeCore Payments', NULL),
(3, 'ZeCore Shipping', NULL),
(4, 'Client+SM', NULL),
(5, 'Production Engineering', NULL),
(6, 'ZeCore CRM', NULL),
(7, 'ZeCore WMS', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `periodo`
--

CREATE TABLE `periodo` (
  `idPeriodo` int(11) NOT NULL,
  `NombrePeriodo` varchar(200) DEFAULT NULL,
  `fecha_inicial` date DEFAULT NULL,
  `fecha_final` date DEFAULT NULL,
  `anio` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `periodo`
--

INSERT INTO `periodo` (`idPeriodo`, `NombrePeriodo`, `fecha_inicial`, `fecha_final`, `anio`) VALUES
(1, 'Enero-Marzo', '2019-01-01', '2019-03-31', 2019),
(2, 'Abril-Junio', '2019-04-01', '2019-06-30', 2019),
(3, 'Julio-Septiembre', '2019-07-01', '2019-09-30', 2019),
(4, 'Octubre-Diciembre', '2019-10-01', '2019-12-22', 2019),
(5, 'Enero-Marzo', '2020-01-01', '2020-03-31', 2020),
(6, 'Abril-Junio', '2020-04-01', '2020-06-30', 2020),
(7, 'Julio-Septiembre', '2020-07-01', '2020-09-30', 2020),
(8, 'Octubre-Diciembre', '2020-10-01', '2020-12-22', 2020),
(9, 'Enero-Marzo', '2021-01-01', '2021-03-31', 2021),
(10, 'Abril-Junio', '2021-04-01', '2021-06-30', 2021),
(11, 'Julio-Septiembre', '2021-07-01', '2021-09-30', 2021),
(12, 'Octubre-Diciembre', '2021-10-01', '2021-12-22', 2021),
(13, 'Abril-Junio', '2022-04-06', '2022-06-06', 2022),
(14, 'Marzo-Julio', '2022-03-18', '2022-07-30', 2022),
(15, 'Abril-Septiembre', '2022-04-01', '2022-09-24', 2022),
(16, 'Julio-Octubre', '2022-07-23', '2022-10-29', 2022),
(17, 'Julio-Octubre', '2022-07-23', '2022-10-29', 2022),
(18, 'Abril-Julio', '2022-04-08', '2022-07-02', 2022),
(20, 'Abril-Junio', '2022-04-08', '2022-06-25', 2022),
(21, 'Abril-Diciembre', '2022-04-01', '2022-12-02', 2022),
(91, 'Abril-Julio', '2022-04-14', '2022-07-02', 2022),
(190, 'Abril-Mayo', '2022-04-29', '2022-05-01', 2022),
(206, 'Abril-Mayo', '2022-04-29', '2022-05-02', 2022),
(217, 'Mayo-Junio', '2022-05-27', '2022-06-04', 2022),
(218, 'Mayo-Mayo', '2022-05-01', '2022-05-03', 2022),
(229, 'Mayo-Mayo', '2022-05-04', '2022-05-19', 2022),
(230, 'Mayo-Mayo', '2022-05-03', '2022-05-04', 2022);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta`
--

CREATE TABLE `pregunta` (
  `idPregunta` int(11) NOT NULL,
  `idTipo` int(11) NOT NULL,
  `pregunta` varchar(400) DEFAULT NULL,
  `nivelP` int(11) DEFAULT NULL,
  `idDimension` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `pregunta`
--

INSERT INTO `pregunta` (`idPregunta`, `idTipo`, `pregunta`, `nivelP`, `idDimension`) VALUES
(1, 1, '¿Demuestra una noción básica de los lenguajes de programación?', 1, 1),
(2, 1, '¿Está interesado en investigar sobre nuevas tecnologías?', 1, 1),
(3, 1, '¿Demuestra una buena comprensión de los lenguajes de programación empresarial?', 2, 1),
(4, 1, '¿Es capaz de diseñar correctamente un sistema básico de API Restful y Frontend App en AWS o similar?', 2, 1),
(5, 1, '¿Tienen un gran conocimiento sobre cómo diseñar un sistema básico y cómo configurarlo para lograr escalabilidad y resistencia?', 3, 1),
(6, 1, '¿Comprueba y monitorea el tiempo de la actividad y la resistencia de los sistemas?', 3, 1),
(7, 1, '¿Es capaz de señalar nuevas formas de configurar herramientas avanzadas como la integración continua', 4, 1),
(8, 1, '¿Es capaz de informar sobre las métricas?', 4, 1),
(9, 1, '¿Es capaz de configurar herramientas avanzadas como la integración continua, pruebas sintéticas y mo', 5, 1),
(10, 1, '¿Es capaz de innovar con nuevas herramientas y estándares de la industria e informes de métricas?', 5, 1),
(11, 1, '¿Se responsabiliza de sus propias tareas y las lleva a cabo?', 1, 2),
(12, 1, '¿Da retroalimentación de manera efectiva y ayuda a otros a desarrollarse con prácticas y consejos?', 2, 2),
(13, 1, '¿Maneja demandas contrapuestas en situaciones de alta presión?', 3, 2),
(14, 1, '¿Es un mentor codiciado para otros?', 4, 2),
(15, 1, '¿Lidera iniciativas emblemáticas desafiantes en toda la empresa?', 5, 2),
(16, 1, '¿Se responsabiliza de los objetivos comerciales?', 1, 3),
(17, 1, '¿Es capaz de contribuir al éxito comercial del equipo y comprender los matices rápidamente?', 2, 3),
(18, 1, '¿Tiene un sólido juicio comercial y de recompensa de riesgo?', 3, 3),
(19, 1, '¿Tiene la capacidad para establecer y lograr KPls y OKRs?', 4, 3),
(20, 1, '¿Tiene la capacidad para liderar con éxito importantes esfuerzos comerciales?', 5, 3),
(21, 2, '¿Por qué o no considerarías asignarle programación empresarial?', 2, 1),
(22, 1, '¿Demuestra disposición para continuar aprendiendo nuevos lenguajes de programación?', 2, 1),
(23, 2, '¿Considera que es bueno relacionándose con los demás?', 3, 2),
(24, 2, '¿Qué lenguajes de programación conoce y desde tu percepción, qué nivel de dominio tiene de éstas?', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntacuestionario`
--

CREATE TABLE `preguntacuestionario` (
  `idCuestionario` int(11) NOT NULL,
  `idPregunta` int(11) NOT NULL,
  `fechaInclusion` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `preguntacuestionario`
--

INSERT INTO `preguntacuestionario` (`idCuestionario`, `idPregunta`, `fechaInclusion`) VALUES
(1, 1, '2020-02-14'),
(1, 2, '2020-02-14'),
(2, 3, '2020-02-15'),
(2, 4, '2020-02-15'),
(2, 21, '2022-04-04'),
(3, 5, '2020-02-16'),
(3, 6, '2020-02-16'),
(4, 7, '2020-02-17'),
(4, 8, '2020-02-17'),
(5, 9, '2020-02-18'),
(5, 10, '2020-02-18'),
(6, 11, '2020-02-19'),
(7, 12, '2020-02-20'),
(8, 13, '2020-02-21'),
(9, 14, '2020-02-22'),
(10, 15, '2020-02-23'),
(11, 16, '2020-02-24'),
(12, 17, '2020-02-24'),
(13, 18, '2020-02-24'),
(14, 19, '2020-02-24'),
(15, 20, '2020-02-24'),
(16, 22, '2022-04-19'),
(16, 3, '2022-04-19'),
(16, 21, '2022-04-19'),
(17, 2, '2022-04-29'),
(18, 1, '2022-04-29'),
(18, 2, '2022-04-29'),
(19, 13, '2022-04-29'),
(19, 23, '2022-04-29'),
(20, 3, '2022-04-29'),
(20, 4, '2022-04-29'),
(20, 22, '2022-04-29'),
(21, 7, '2022-05-03'),
(22, 1, '2022-05-03'),
(23, 1, '2022-05-03'),
(23, 2, '2022-05-03'),
(23, 24, '2022-05-03'),
(24, 1, '2022-05-03'),
(25, 2, '2022-05-03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `privilegio`
--

CREATE TABLE `privilegio` (
  `idPrivilegio` int(11) NOT NULL,
  `accion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `privilegio`
--

INSERT INTO `privilegio` (`idPrivilegio`, `accion`) VALUES
(1, 'Ver mentorados'),
(2, 'Agregar empleado'),
(3, 'Formatos de evaluación');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respondesolicita`
--

CREATE TABLE `respondesolicita` (
  `idEvaluado` int(11) NOT NULL,
  `idEvaluador` int(11) NOT NULL,
  `idPregunta` int(11) NOT NULL,
  `idPeriodo` int(11) NOT NULL,
  `respuesta` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `respondesolicita`
--

INSERT INTO `respondesolicita` (`idEvaluado`, `idEvaluador`, `idPregunta`, `idPeriodo`, `respuesta`) VALUES
(1, 2, 3, 2, NULL),
(3, 6, 5, 1, '2'),
(3, 6, 6, 1, '5'),
(3, 7, 12, 3, '3'),
(3, 8, 5, 3, '2'),
(3, 8, 6, 3, '3'),
(4, 3, 7, 4, '3'),
(4, 3, 8, 4, '5'),
(5, 2, 9, 10, '5'),
(5, 2, 10, 10, '4'),
(5, 6, 16, 3, '2'),
(8, 6, 20, 4, '1'),
(8, 9, 19, 2, '1'),
(9, 7, 16, 4, '2'),
(9, 19, 3, 1, '2'),
(9, 19, 4, 1, '4'),
(12, 15, 7, 5, '4'),
(12, 15, 8, 5, '1'),
(13, 16, 13, 5, '3'),
(13, 17, 1, 6, '2'),
(13, 17, 2, 6, '2'),
(18, 9, 15, 5, '5'),
(19, 9, 19, 4, '2'),
(3, 1, 5, 13, '5'),
(3, 1, 6, 13, '5'),
(3, 1, 12, 13, '5'),
(3, 1, 17, 13, '5'),
(2, 1, 3, 13, '5'),
(2, 1, 4, 13, '5'),
(2, 1, 21, 13, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
(2, 1, 12, 13, '2'),
(2, 1, 19, 13, '5'),
(11, 3, 7, 13, '5'),
(11, 3, 8, 13, '5'),
(11, 3, 14, 13, '5'),
(11, 3, 18, 13, '5'),
(1, 2, 5, 21, '5'),
(1, 2, 6, 21, '4'),
(1, 2, 13, 21, '4'),
(1, 2, 17, 21, '5'),
(3, 2, 5, 21, '3'),
(3, 2, 6, 21, '4'),
(3, 2, 12, 21, '3'),
(3, 2, 17, 21, '5'),
(20, 5, 9, 21, '4'),
(20, 5, 10, 21, '1'),
(20, 5, 11, 21, '3'),
(20, 5, 20, 21, '2'),
(16, 5, 1, 21, '3'),
(16, 5, 2, 21, '4'),
(16, 5, 12, 21, '5'),
(16, 5, 16, 21, '3'),
(11, 15, 7, 21, '5'),
(11, 15, 8, 21, '5'),
(11, 15, 14, 21, '5'),
(11, 15, 18, 21, '5'),
(3, 1, 5, 21, '5'),
(3, 1, 6, 21, '5'),
(3, 1, 12, 21, '5'),
(3, 1, 17, 21, '3'),
(2, 15, 22, 21, '5'),
(2, 15, 3, 21, '4'),
(2, 15, 21, 21, 'Es muy bueno aprendiendo por su cuenta y muestra disponibilidad al tratarse de proyectos'),
(2, 15, 12, 21, '5'),
(2, 15, 19, 21, '4'),
(24, 3, 22, 21, '2'),
(24, 3, 3, 21, '3'),
(24, 3, 21, 21, 'Debido a que muestra gran disposición pa'),
(24, 3, 11, 21, '2'),
(24, 3, 16, 21, '3'),
(3, 1, 5, 91, '5'),
(3, 1, 6, 91, '5'),
(3, 1, 12, 91, '5'),
(3, 1, 17, 91, '5'),
(1, 2, 5, 91, '3'),
(1, 2, 6, 91, '4'),
(1, 2, 13, 91, '5'),
(1, 2, 17, 91, '3'),
(3, 16, 5, 91, '5'),
(3, 16, 6, 91, '4'),
(3, 16, 12, 91, '4'),
(3, 16, 17, 91, '3'),
(2, 1, 22, 190, '5'),
(2, 1, 3, 190, '5'),
(2, 1, 21, 190, 'Hola'),
(2, 1, 12, 190, '5'),
(2, 1, 19, 190, '5'),
(2, 3, 22, 190, '3'),
(2, 3, 3, 190, '5'),
(2, 3, 21, 190, 'Porque es chido'),
(2, 3, 12, 190, '5'),
(2, 3, 19, 190, '3'),
(2, 1, 22, 206, '4'),
(2, 1, 3, 206, '5'),
(2, 1, 21, 206, 'Porque es la hostia'),
(2, 1, 12, 206, '4'),
(2, 1, 19, 206, '5'),
(26, 1, 7, 206, '5'),
(26, 1, 8, 206, '3'),
(26, 1, 14, 206, '5'),
(26, 1, 19, 206, '5'),
(15, 1, 1, 206, '5'),
(15, 1, 2, 206, '4'),
(15, 1, 12, 206, '5'),
(15, 1, 16, 206, '5'),
(5, 1, 22, 206, '3'),
(5, 1, 3, 206, '5'),
(5, 1, 21, 206, 'Es muy buena programando'),
(5, 1, 11, 206, '5'),
(5, 1, 18, 206, '3'),
(1, 2, 5, 206, '4'),
(1, 2, 6, 206, '5'),
(1, 2, 13, 206, '4'),
(1, 2, 23, 206, 'Sí'),
(1, 2, 17, 206, '3'),
(1, 4, 5, 218, '4'),
(1, 4, 6, 218, '5'),
(1, 4, 13, 218, '3'),
(1, 4, 23, 218, 'Sí. Siempre está al tanto de nosotros ya'),
(1, 4, 17, 218, '5'),
(1, 5, 5, 218, '5'),
(1, 5, 6, 218, '4'),
(1, 5, 13, 218, '5'),
(1, 5, 23, 218, 'Sí, es muy bueno en ello ya que promueve'),
(1, 5, 17, 218, '4'),
(4, 5, 7, 218, '4'),
(4, 5, 14, 218, '5'),
(4, 5, 17, 218, '4'),
(1, 26, 5, 218, '5'),
(1, 26, 6, 218, '4'),
(1, 26, 13, 218, '4'),
(1, 26, 23, 218, 'Sí, él siempre busca la buena convivenci'),
(1, 26, 17, 218, '3'),
(1, 3, 5, 218, '5'),
(1, 3, 6, 218, '4'),
(1, 3, 13, 218, '4'),
(1, 3, 23, 218, 'Hola. Espero que funcione el cambio de t'),
(1, 3, 17, 218, '5');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `retroalimentacion`
--

CREATE TABLE `retroalimentacion` (
  `idEvaluado` int(11) NOT NULL,
  `idEvaluador` int(11) NOT NULL,
  `idCuestionarioCraft` int(11) NOT NULL,
  `idCuestionarioPeople` int(11) DEFAULT NULL,
  `idCuestionarioBusiness` int(11) DEFAULT NULL,
  `idPeriodo` int(11) NOT NULL,
  `estatus` tinyint(1) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `comentarios` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `retroalimentacion`
--

INSERT INTO `retroalimentacion` (`idEvaluado`, `idEvaluador`, `idCuestionarioCraft`, `idCuestionarioPeople`, `idCuestionarioBusiness`, `idPeriodo`, `estatus`, `fecha`, `comentarios`) VALUES
(1, 5, 8, NULL, NULL, 8, 1, '2020-11-22 00:00:00', 'Esto es un comentario'),
(2, 1, 2, 6, 11, 12, NULL, '2022-03-24 00:27:16', NULL),
(2, 1, 3, NULL, NULL, 2, NULL, '2022-03-28 21:13:01', NULL),
(2, 7, 7, NULL, NULL, 7, 1, '2020-08-08 00:00:00', 'Esto es un comentario'),
(2, 9, 11, NULL, NULL, 12, 1, '2021-08-08 00:00:00', 'Esto es un comentario'),
(3, 1, 3, 7, 12, 12, NULL, '2022-03-31 22:20:11', NULL),
(3, 5, 8, NULL, NULL, 8, 1, '2020-11-22 00:00:00', 'Esto es un comentario'),
(3, 5, 10, NULL, NULL, 10, 1, '2021-05-10 00:00:00', 'Esto es un comentario'),
(3, 7, 2, NULL, NULL, 3, 1, '2019-08-08 00:00:00', 'Esto es un comentario'),
(3, 8, 1, NULL, NULL, 1, 1, '2020-02-02 00:00:00', 'Esto es un comentario'),
(3, 11, 3, NULL, NULL, 12, 1, '2021-08-10 00:00:00', 'Esto es un comentario'),
(3, 20, 11, NULL, NULL, 11, 1, '2021-08-08 00:00:00', 'Esto es un comentario'),
(4, 3, 1, NULL, NULL, 12, 1, '2019-11-22 00:00:00', 'Esto es un comentario'),
(4, 21, 4, NULL, NULL, 12, 1, '2021-08-10 00:00:00', 'Esto es un comentario'),
(5, 2, 5, NULL, NULL, 10, 1, '2021-05-10 00:00:00', 'Esto es un comentario'),
(5, 2, 7, NULL, NULL, 7, 1, '2020-08-08 00:00:00', 'Esto es un comentario'),
(5, 6, 3, NULL, NULL, 3, 1, '2019-08-08 00:00:00', 'Esto es un comentario'),
(5, 9, 2, NULL, NULL, 12, 1, '2021-08-10 00:00:00', 'Esto es un comentario'),
(6, 7, 6, NULL, NULL, 12, 1, '2021-08-10 00:00:00', 'Esto es un comentario'),
(6, 8, 6, NULL, NULL, 6, 1, '2020-05-10 00:00:00', 'Esto es un comentario'),
(6, 8, 9, NULL, NULL, 9, 1, '2021-02-02 00:00:00', 'Esto es un comentario'),
(6, 20, 8, NULL, NULL, 8, 1, '2020-11-22 00:00:00', 'Esto es un comentario'),
(7, 6, 7, NULL, NULL, 12, 1, '2021-08-10 00:00:00', 'Esto es un comentario'),
(8, 4, 11, NULL, NULL, 12, 1, '2021-08-08 00:00:00', 'Esto es un comentario'),
(8, 6, 3, NULL, NULL, 2, 1, '0000-00-00 00:00:00', 'Esto es un comentario'),
(8, 6, 7, NULL, NULL, 7, 1, '2020-08-08 00:00:00', 'Esto es un comentario'),
(8, 6, 10, NULL, NULL, 10, 1, '2021-05-10 00:00:00', 'Esto es un comentario'),
(8, 9, 3, NULL, NULL, 1, 1, '2020-02-02 00:00:00', 'Esto es un comentario'),
(8, 15, 4, NULL, NULL, 12, 1, '2021-08-10 00:00:00', 'Esto es un comentario'),
(9, 2, 7, NULL, NULL, 7, 1, '2020-08-08 00:00:00', 'Esto es un comentario'),
(9, 2, 9, NULL, NULL, 9, 1, '2021-02-02 00:00:00', 'Esto es un comentario'),
(9, 3, 6, NULL, NULL, 6, 1, '2020-05-10 00:00:00', 'Esto es un comentario'),
(9, 3, 9, NULL, NULL, 9, 1, '2021-02-02 00:00:00', 'Esto es un comentario'),
(9, 5, 2, NULL, NULL, 12, 0, '2021-08-10 00:00:00', 'Esto es un comentario'),
(9, 7, 3, NULL, NULL, 4, 1, '2019-11-22 00:00:00', 'Esto es un comentario'),
(9, 19, 1, NULL, NULL, 1, 1, '2020-02-02 00:00:00', 'Esto es un comentario'),
(10, 3, 11, NULL, NULL, 11, NULL, '2021-08-08 00:00:00', 'Esto es un comentario'),
(10, 9, 3, NULL, NULL, 12, 1, '2021-08-10 00:00:00', 'Esto es un comentario'),
(11, 3, 4, NULL, NULL, 12, 1, '2021-08-10 00:00:00', 'Esto es un comentario'),
(12, 7, 9, NULL, NULL, 9, 1, '2021-02-02 00:00:00', 'Esto es un comentario'),
(12, 15, 1, NULL, NULL, 5, 1, '2020-02-02 00:00:00', 'Esto es un comentario'),
(13, 16, 3, NULL, NULL, 2, 1, '0000-00-00 00:00:00', 'Esto es un comentario'),
(13, 17, 1, NULL, NULL, 6, 1, '2020-05-10 00:00:00', 'Esto es un comentario'),
(13, 21, 10, NULL, NULL, 10, 1, '2021-05-10 00:00:00', 'Esto es un comentario'),
(15, 8, 1, NULL, NULL, 12, 1, '2021-08-10 00:00:00', 'Esto es un comentario'),
(16, 1, 1, 7, 11, 12, NULL, '2021-08-10 00:00:00', 'Esto es un comentario'),
(16, 6, 10, NULL, NULL, 10, 1, '2021-05-10 00:00:00', 'Esto es un comentario'),
(17, 1, 9, NULL, NULL, 12, 1, '2021-08-10 00:00:00', 'Esto es un comentario'),
(19, 9, 3, NULL, NULL, 4, 1, '2019-11-22 00:00:00', 'Esto es un comentario'),
(20, 8, 11, NULL, NULL, 12, 1, '2021-08-08 00:00:00', 'Esto es un comentario'),
(21, 1, 2, NULL, NULL, 11, 1, '2021-08-10 00:00:00', 'Esto es un comentario'),
(1, 5, 3, 8, 12, 13, NULL, '2022-04-06 16:32:03', NULL),
(1, 6, 3, 8, 12, 13, NULL, '2022-04-06 16:32:03', NULL),
(1, 15, 3, 8, 12, 13, NULL, '2022-04-06 19:14:54', NULL),
(3, 1, 3, 7, 12, 13, 1, '2022-04-07 11:56:49', NULL),
(1, 17, 3, 8, 12, 13, NULL, '2022-04-07 12:07:17', NULL),
(2, 1, 2, 7, 14, 13, 1, '2022-04-08 08:02:39', NULL),
(3, 4, 3, 7, 12, 13, NULL, '2022-04-14 17:26:39', NULL),
(1, 2, 3, 8, 12, 13, NULL, '2022-04-18 12:33:35', NULL),
(1, 23, 3, 8, 12, 13, NULL, '2022-04-18 13:01:34', NULL),
(1, 18, 3, 8, 12, 13, NULL, '2022-04-18 13:28:27', NULL),
(11, 3, 4, 9, 13, 13, 1, '2022-04-19 12:29:49', NULL),
(2, 4, 16, 7, 14, 13, NULL, '2022-04-19 23:04:55', NULL),
(2, 7, 16, 7, 14, 13, NULL, '2022-04-19 23:04:56', NULL),
(2, 8, 16, 7, 14, 13, NULL, '2022-04-19 23:04:56', NULL),
(2, 15, 16, 7, 14, 13, NULL, '2022-04-20 13:57:00', NULL),
(21, 1, 16, 10, 14, 13, NULL, '2022-04-20 14:27:16', NULL),
(21, 1, 16, 10, 14, 13, NULL, '2022-04-20 14:27:17', NULL),
(2, 9, 16, 7, 14, 13, NULL, '2022-04-20 14:57:45', NULL),
(2, 21, 16, 7, 14, 13, NULL, '2022-04-20 15:07:47', NULL),
(11, 1, 4, 9, 13, 13, NULL, '2022-04-20 15:09:45', NULL),
(11, 1, 4, 9, 13, 13, NULL, '2022-04-20 15:09:46', NULL),
(11, 1, 4, 9, 13, 13, NULL, '2022-04-20 15:09:46', NULL),
(11, 1, 4, 9, 13, 13, NULL, '2022-04-20 15:09:46', NULL),
(11, 1, 4, 9, 13, 13, NULL, '2022-04-20 15:09:46', NULL),
(11, 1, 4, 9, 13, 13, NULL, '2022-04-20 15:09:46', NULL),
(11, 1, 4, 9, 13, 13, NULL, '2022-04-20 15:09:47', NULL),
(21, 7, 16, 10, 14, 13, NULL, '2022-04-20 15:22:31', NULL),
(21, 7, 16, 10, 14, 13, NULL, '2022-04-20 15:22:31', NULL),
(21, 7, 16, 10, 14, 13, NULL, '2022-04-20 15:22:32', NULL),
(21, 7, 16, 10, 14, 13, NULL, '2022-04-20 15:22:32', NULL),
(21, 7, 16, 10, 14, 13, NULL, '2022-04-20 15:22:32', NULL),
(21, 7, 16, 10, 14, 13, NULL, '2022-04-20 15:22:32', NULL),
(20, 2, 5, 6, 15, 13, NULL, '2022-04-20 15:26:02', NULL),
(20, 1, 5, 6, 15, 13, NULL, '2022-04-20 15:26:38', NULL),
(20, 8, 5, 6, 15, 13, NULL, '2022-04-20 15:26:44', NULL),
(20, 8, 5, 6, 15, 13, NULL, '2022-04-20 15:26:44', NULL),
(20, 7, 5, 6, 15, 13, NULL, '2022-04-20 15:27:32', NULL),
(20, 9, 5, 6, 15, 13, NULL, '2022-04-20 15:27:38', NULL),
(20, 12, 5, 6, 15, 13, NULL, '2022-04-20 15:27:46', NULL),
(16, 2, 1, 7, 11, 13, NULL, '2022-04-20 15:28:08', NULL),
(16, 3, 1, 7, 11, 13, NULL, '2022-04-20 15:28:57', NULL),
(16, 8, 1, 7, 11, 13, NULL, '2022-04-20 15:29:43', NULL),
(16, 1, 1, 7, 11, 20, NULL, '2022-04-20 15:55:19', NULL),
(16, 3, 1, 7, 11, 20, NULL, '2022-04-20 15:57:05', NULL),
(16, 6, 1, 7, 11, 20, NULL, '2022-04-20 15:57:13', NULL),
(2, 4, 16, 7, 14, 20, NULL, '2022-04-20 16:36:30', NULL),
(1, 2, 3, 8, 12, 21, 1, '2022-04-20 17:05:43', NULL),
(3, 1, 3, 7, 12, 21, 1, '2022-04-21 02:35:31', NULL),
(3, 2, 3, 7, 12, 21, 1, '2022-04-21 09:54:27', NULL),
(20, 5, 5, 6, 15, 21, 1, '2022-04-21 10:46:11', NULL),
(20, 7, 5, 6, 15, 21, NULL, '2022-04-21 10:46:11', NULL),
(16, 5, 1, 7, 11, 21, 1, '2022-04-21 10:48:04', NULL),
(11, 5, 4, 9, 13, 21, NULL, '2022-04-21 10:49:44', NULL),
(11, 15, 4, 9, 13, 21, 1, '2022-04-21 11:47:42', NULL),
(15, 11, 1, 7, 11, 21, NULL, '2022-04-21 11:51:02', NULL),
(26, 27, 4, 9, 14, 21, NULL, '2022-04-21 12:06:40', NULL),
(2, 7, 16, 7, 14, 21, NULL, '2022-04-21 23:50:02', NULL),
(2, 1, 16, 7, 14, 21, NULL, '2022-04-21 23:50:02', NULL),
(2, 9, 16, 7, 14, 21, NULL, '2022-04-21 23:50:03', NULL),
(2, 14, 16, 7, 14, 21, NULL, '2022-04-21 23:51:44', NULL),
(2, 13, 16, 7, 14, 21, NULL, '2022-04-21 23:51:44', NULL),
(2, 15, 16, 7, 14, 21, 1, '2022-04-21 23:51:44', NULL),
(2, 16, 16, 7, 14, 21, NULL, '2022-04-21 23:52:07', NULL),
(15, 1, 1, 7, 11, 21, NULL, '2022-04-21 23:03:32', NULL),
(15, 2, 1, 7, 11, 21, NULL, '2022-04-21 23:03:40', NULL),
(24, 3, 16, 6, 11, 21, 1, '2022-04-21 23:04:42', NULL),
(3, 4, 3, 7, 12, 21, NULL, '2022-04-22 04:11:43', NULL),
(3, 1, 3, 7, 12, 91, 1, '2022-04-22 17:09:45', NULL),
(2, 1, 16, 7, 14, 91, NULL, '2022-04-23 11:16:10', NULL),
(1, 2, 3, 8, 12, 91, 1, '2022-04-23 11:18:16', NULL),
(2, 18, 16, 7, 14, 91, NULL, '2022-04-23 16:55:07', NULL),
(1, 5, 3, 8, 12, 91, NULL, '2022-04-26 16:57:26', NULL),
(3, 16, 3, 7, 12, 91, 1, '2022-04-26 20:05:52', NULL),
(1, 11, 3, 8, 12, 91, NULL, '2022-04-28 11:52:41', NULL),
(2, 1, 16, 7, 14, 190, 1, '2022-04-29 10:21:14', NULL),
(2, 3, 16, 7, 14, 190, 1, '2022-04-29 10:35:06', NULL),
(2, 1, 16, 7, 14, 206, 1, '2022-04-29 10:50:39', NULL),
(26, 1, 4, 9, 14, 206, 1, '2022-04-29 11:16:06', NULL),
(15, 1, 18, 7, 11, 206, 1, '2022-04-29 11:20:13', NULL),
(5, 1, 16, 6, 13, 206, 1, '2022-04-29 11:26:36', NULL),
(1, 2, 3, 19, 12, 206, 1, '2022-04-29 13:22:48', NULL),
(1, 4, 3, 19, 12, 218, 1, '2022-05-02 12:16:52', NULL),
(1, 3, 3, 19, 12, 218, 1, '2022-05-03 08:35:29', NULL),
(1, 5, 3, 19, 12, 218, 1, '2022-05-03 08:35:30', NULL),
(4, 5, 21, 9, 12, 218, 1, '2022-05-03 09:13:58', NULL),
(26, 4, 21, 9, 14, 218, NULL, '2022-05-03 09:15:35', NULL),
(26, 5, 21, 9, 14, 218, NULL, '2022-05-03 09:15:35', NULL),
(1, 26, 3, 19, 12, 218, 1, '2022-05-03 09:16:16', NULL),
(1, 10, 3, 19, 13, 218, NULL, '2022-05-04 12:53:46', NULL),
(4, 1, 21, 9, 12, 218, NULL, '2022-05-04 16:24:30', NULL),
(4, 2, 21, 9, 12, 218, NULL, '2022-05-04 16:24:30', NULL),
(4, 15, 21, 9, 12, 218, NULL, '2022-05-04 16:26:05', NULL),
(1, 4, 3, 19, 13, 230, NULL, '2022-05-04 19:32:40', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `idRol` int(11) NOT NULL,
  `nombre` varchar(30) DEFAULT NULL,
  `descripcion` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`idRol`, `nombre`, `descripcion`) VALUES
(1, 'CL', 'Chapter Leader'),
(2, 'CLA', 'Chapter Leader Assistant'),
(3, 'CM', 'Chapter Member');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rolempleado`
--

CREATE TABLE `rolempleado` (
  `idEmpleado` int(11) NOT NULL,
  `idRol` int(11) NOT NULL,
  `fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `rolempleado`
--

INSERT INTO `rolempleado` (`idEmpleado`, `idRol`, `fecha`) VALUES
(1, 1, '2020-02-01'),
(2, 2, '2020-02-02'),
(3, 3, '2020-02-03'),
(4, 3, '2020-02-04'),
(5, 3, '2020-02-05'),
(6, 3, '2020-02-01'),
(7, 2, '2020-02-02'),
(8, 3, '2020-02-03'),
(9, 3, '2020-02-04'),
(10, 3, '2020-02-05'),
(11, 3, '2020-02-01'),
(12, 3, '2020-02-02'),
(13, 2, '2020-02-03'),
(14, 3, '2020-02-05'),
(15, 3, '2020-02-05'),
(16, 3, '2020-02-01'),
(17, 3, '2020-02-02'),
(18, 3, '2020-02-03'),
(19, 3, '2020-02-04'),
(20, 2, '2020-02-05'),
(21, 3, '2020-02-01'),
(23, 2, '2022-04-08'),
(24, 2, '2022-04-20'),
(25, 3, '2022-04-20'),
(26, 1, '2022-04-21'),
(27, 3, '2022-04-21'),
(28, 3, '2022-04-21'),
(29, 1, '2022-04-25'),
(30, 2, '2022-04-25'),
(31, 3, '2022-04-26'),
(32, 3, '2022-05-01'),
(33, 2, '2022-05-01'),
(34, 1, '2022-05-03'),
(35, 2, '2022-05-03'),
(36, 1, '2022-05-03'),
(37, 1, '2022-05-04'),
(38, 1, '2022-05-04'),
(39, 1, '2022-05-04'),
(40, 3, '2022-05-04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rolprivilegio`
--

CREATE TABLE `rolprivilegio` (
  `idRol` int(11) NOT NULL,
  `idPrivilegio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `rolprivilegio`
--

INSERT INTO `rolprivilegio` (`idRol`, `idPrivilegio`) VALUES
(1, 2),
(1, 1),
(2, 1),
(1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipopregunta`
--

CREATE TABLE `tipopregunta` (
  `idTipo` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipopregunta`
--

INSERT INTO `tipopregunta` (`idTipo`, `descripcion`) VALUES
(1, 'numérica'),
(2, 'texto');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asignacionempleado`
--
ALTER TABLE `asignacionempleado`
  ADD PRIMARY KEY (`idMentor`,`idMentorado`),
  ADD KEY `idMentor` (`idMentor`) USING BTREE,
  ADD KEY `idMentorado` (`idMentorado`);

--
-- Indices de la tabla `cuestionario`
--
ALTER TABLE `cuestionario`
  ADD PRIMARY KEY (`idCuestionario`);

--
-- Indices de la tabla `cuestionario_actual`
--
ALTER TABLE `cuestionario_actual`
  ADD PRIMARY KEY (`idCuestionario`);

--
-- Indices de la tabla `dimempleado`
--
ALTER TABLE `dimempleado`
  ADD PRIMARY KEY (`idEmpleado`,`idDimension`,`fecha`) USING BTREE,
  ADD KEY `idEmpleado` (`idEmpleado`),
  ADD KEY `idDimension` (`idDimension`);

--
-- Indices de la tabla `dimempleado_actual`
--
ALTER TABLE `dimempleado_actual`
  ADD PRIMARY KEY (`idEmpleado`,`idDimension`,`fecha`) USING BTREE,
  ADD KEY `idEmpleado` (`idEmpleado`),
  ADD KEY `idDimension` (`idDimension`);

--
-- Indices de la tabla `dimension`
--
ALTER TABLE `dimension`
  ADD PRIMARY KEY (`idDimension`);

--
-- Indices de la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`idEmpleado`),
  ADD KEY `idEquipo` (`idEquipo`);

--
-- Indices de la tabla `equipo`
--
ALTER TABLE `equipo`
  ADD PRIMARY KEY (`idEquipo`);

--
-- Indices de la tabla `periodo`
--
ALTER TABLE `periodo`
  ADD PRIMARY KEY (`idPeriodo`);

--
-- Indices de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD PRIMARY KEY (`idPregunta`),
  ADD KEY `idDimension` (`idDimension`),
  ADD KEY `idTipo` (`idTipo`);

--
-- Indices de la tabla `preguntacuestionario`
--
ALTER TABLE `preguntacuestionario`
  ADD KEY `idCuestionario` (`idCuestionario`),
  ADD KEY `idPregunta` (`idPregunta`);

--
-- Indices de la tabla `privilegio`
--
ALTER TABLE `privilegio`
  ADD PRIMARY KEY (`idPrivilegio`);

--
-- Indices de la tabla `respondesolicita`
--
ALTER TABLE `respondesolicita`
  ADD KEY `idEvaluado` (`idEvaluado`),
  ADD KEY `idEvaluador` (`idEvaluador`),
  ADD KEY `idPregunta` (`idPregunta`),
  ADD KEY `idPeriodo` (`idPeriodo`);

--
-- Indices de la tabla `retroalimentacion`
--
ALTER TABLE `retroalimentacion`
  ADD KEY `idEvaluado` (`idEvaluado`),
  ADD KEY `idEvaluador` (`idEvaluador`),
  ADD KEY `idCuestionarioCraft` (`idCuestionarioCraft`),
  ADD KEY `idCuestionarioPeople` (`idCuestionarioPeople`),
  ADD KEY `idCuestionarioBusiness` (`idCuestionarioBusiness`),
  ADD KEY `idPeriodo` (`idPeriodo`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`idRol`);

--
-- Indices de la tabla `rolempleado`
--
ALTER TABLE `rolempleado`
  ADD KEY `idEmpleado` (`idEmpleado`),
  ADD KEY `idRol` (`idRol`);

--
-- Indices de la tabla `rolprivilegio`
--
ALTER TABLE `rolprivilegio`
  ADD KEY `idRol` (`idRol`),
  ADD KEY `idPrivilegio` (`idPrivilegio`);

--
-- Indices de la tabla `tipopregunta`
--
ALTER TABLE `tipopregunta`
  ADD PRIMARY KEY (`idTipo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cuestionario`
--
ALTER TABLE `cuestionario`
  MODIFY `idCuestionario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `cuestionario_actual`
--
ALTER TABLE `cuestionario_actual`
  MODIFY `idCuestionario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `dimension`
--
ALTER TABLE `dimension`
  MODIFY `idDimension` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `empleado`
--
ALTER TABLE `empleado`
  MODIFY `idEmpleado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `equipo`
--
ALTER TABLE `equipo`
  MODIFY `idEquipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `periodo`
--
ALTER TABLE `periodo`
  MODIFY `idPeriodo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=233;

--
-- AUTO_INCREMENT de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  MODIFY `idPregunta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `privilegio`
--
ALTER TABLE `privilegio`
  MODIFY `idPrivilegio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `idRol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tipopregunta`
--
ALTER TABLE `tipopregunta`
  MODIFY `idTipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asignacionempleado`
--
ALTER TABLE `asignacionempleado`
  ADD CONSTRAINT `asignacionempleado_ibfk_1` FOREIGN KEY (`idMentor`) REFERENCES `empleado` (`idEmpleado`),
  ADD CONSTRAINT `asignacionempleado_ibfk_2` FOREIGN KEY (`idMentorado`) REFERENCES `empleado` (`idEmpleado`);

--
-- Filtros para la tabla `dimempleado`
--
ALTER TABLE `dimempleado`
  ADD CONSTRAINT `dimempleado_ibfk_1` FOREIGN KEY (`idEmpleado`) REFERENCES `empleado` (`idEmpleado`),
  ADD CONSTRAINT `dimempleado_ibfk_2` FOREIGN KEY (`idDimension`) REFERENCES `dimension` (`idDimension`);

--
-- Filtros para la tabla `dimempleado_actual`
--
ALTER TABLE `dimempleado_actual`
  ADD CONSTRAINT `dimempleado_actual_ibfk_1` FOREIGN KEY (`idDimension`) REFERENCES `dimension` (`idDimension`),
  ADD CONSTRAINT `dimempleado_actual_ibfk_2` FOREIGN KEY (`idEmpleado`) REFERENCES `empleado` (`idEmpleado`);

--
-- Filtros para la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD CONSTRAINT `empleado_ibfk_1` FOREIGN KEY (`idEquipo`) REFERENCES `equipo` (`idEquipo`);

--
-- Filtros para la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD CONSTRAINT `pregunta_ibfk_1` FOREIGN KEY (`idDimension`) REFERENCES `dimension` (`idDimension`),
  ADD CONSTRAINT `pregunta_ibfk_2` FOREIGN KEY (`idTipo`) REFERENCES `tipopregunta` (`idTipo`);

--
-- Filtros para la tabla `preguntacuestionario`
--
ALTER TABLE `preguntacuestionario`
  ADD CONSTRAINT `preguntacuestionario_ibfk_1` FOREIGN KEY (`idCuestionario`) REFERENCES `cuestionario` (`idCuestionario`),
  ADD CONSTRAINT `preguntacuestionario_ibfk_2` FOREIGN KEY (`idPregunta`) REFERENCES `pregunta` (`idPregunta`);

--
-- Filtros para la tabla `respondesolicita`
--
ALTER TABLE `respondesolicita`
  ADD CONSTRAINT `respondesolicita_ibfk_1` FOREIGN KEY (`idEvaluador`) REFERENCES `empleado` (`idEmpleado`),
  ADD CONSTRAINT `respondesolicita_ibfk_2` FOREIGN KEY (`idEvaluado`) REFERENCES `empleado` (`idEmpleado`);

--
-- Filtros para la tabla `retroalimentacion`
--
ALTER TABLE `retroalimentacion`
  ADD CONSTRAINT `retroalimentacion_ibfk_1` FOREIGN KEY (`idEvaluado`) REFERENCES `empleado` (`idEmpleado`),
  ADD CONSTRAINT `retroalimentacion_ibfk_2` FOREIGN KEY (`idEvaluador`) REFERENCES `empleado` (`idEmpleado`),
  ADD CONSTRAINT `retroalimentacion_ibfk_3` FOREIGN KEY (`idCuestionarioCraft`) REFERENCES `cuestionario` (`idCuestionario`),
  ADD CONSTRAINT `retroalimentacion_ibfk_4` FOREIGN KEY (`idCuestionarioPeople`) REFERENCES `cuestionario` (`idCuestionario`),
  ADD CONSTRAINT `retroalimentacion_ibfk_5` FOREIGN KEY (`idCuestionarioBusiness`) REFERENCES `cuestionario` (`idCuestionario`),
  ADD CONSTRAINT `retroalimentacion_ibfk_6` FOREIGN KEY (`idPeriodo`) REFERENCES `periodo` (`idPeriodo`);

--
-- Filtros para la tabla `rolempleado`
--
ALTER TABLE `rolempleado`
  ADD CONSTRAINT `rolempleado_ibfk_1` FOREIGN KEY (`idEmpleado`) REFERENCES `empleado` (`idEmpleado`),
  ADD CONSTRAINT `rolempleado_ibfk_2` FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`);

--
-- Filtros para la tabla `rolprivilegio`
--
ALTER TABLE `rolprivilegio`
  ADD CONSTRAINT `rolprivilegio_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`),
  ADD CONSTRAINT `rolprivilegio_ibfk_2` FOREIGN KEY (`idPrivilegio`) REFERENCES `privilegio` (`idPrivilegio`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
