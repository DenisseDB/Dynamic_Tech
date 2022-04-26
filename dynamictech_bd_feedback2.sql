SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dynamictech_bd_feedback2`
--

DELIMITER $$
--
-- Procedures
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `modificarEmpleado` (IN `U_nombre` VARCHAR(100), IN `U_apellidoP` VARCHAR(100), IN `U_apellidoM` VARCHAR(100), IN `U_correo` VARCHAR(400), IN `U_contrasena` VARCHAR(400), IN `U_idEquipo` INT, IN `U_idEmpleado` INT, IN `U_idRol` INT, IN `U_nivelCraft` FLOAT, IN `U_nivelPeople` FLOAT, IN `U_nivelBusiness` FLOAT, IN `U_fotoPerfil` VARCHAR(1000))   BEGIN

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

CREATE DEFINER=`root`@`localhost` PROCEDURE `registrarFeedback` (IN `U_idEvaluado` INT, IN `U_idEvaluador` INT, IN `U_idPregunta` INT, IN `U_idPeriodo` INT, IN `U_respuesta` VARCHAR(40))   BEGIN 
INSERT INTO respondesolicita VALUES(U_idEvaluado,U_idEvaluador, U_idPregunta, U_idPeriodo,U_respuesta);

UPDATE retroalimentacion SET estatus = 1 WHERE idEvaluador = U_idEvaluador and idEvaluado = U_idEvaluado and idPeriodo = U_idPeriodo;
    
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `asignacionempleado`
--

CREATE TABLE `asignacionempleado` (
  `idMentor` int(11) NOT NULL,
  `idMentorado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `asignacionempleado`
--

INSERT INTO `asignacionempleado` (`idMentor`, `idMentorado`) VALUES
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(2, 8),
(2, 9),
(2, 10),
(7, 11),
(7, 12),
(7, 14),
(13, 15),
(13, 16),
(13, 17),
(20, 18),
(20, 19),
(20, 21);

-- --------------------------------------------------------

--
-- Table structure for table `cuestionario`
--

CREATE TABLE `cuestionario` (
  `idCuestionario` int(11) NOT NULL,
  `nombre` varchar(30) DEFAULT NULL,
  `fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cuestionario`
--

INSERT INTO `cuestionario` (`idCuestionario`, `nombre`, `fecha`) VALUES
(1, 'Craft1', '2020-02-14'),
(2, 'Craft2', '2020-02-15'),
(3, 'Craft3', '2020-02-16'),
(4, 'Craft4', '2020-02-17'),
(5, 'Craft5', '2020-02-18'),
(6, 'People1', '2020-02-14'),
(7, 'People2', '2020-02-15'),
(8, 'People3', '2020-02-16'),
(9, 'People4', '2020-02-17'),
(10, 'People5', '2020-02-18'),
(11, 'Business1', '2020-02-14'),
(12, 'Business2', '2020-02-15'),
(13, 'Business3', '2020-02-16'),
(14, 'Business4', '2020-02-17'),
(15, 'Business5', '2020-02-18'),
(16, 'MiNuevoCuestionario', '2022-04-19');

-- --------------------------------------------------------

--
-- Table structure for table `dimempleado`
--

CREATE TABLE `dimempleado` (
  `idEmpleado` int(11) NOT NULL,
  `idDimension` int(11) NOT NULL,
  `nivelE` float DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dimempleado`
--

INSERT INTO `dimempleado` (`idEmpleado`, `idDimension`, `nivelE`, `fecha`) VALUES
(1, 1, 3.1, '2019-12-31 23:00:00'),
(1, 1, 3.2, '2020-02-29 23:00:00'),
(1, 1, 3.4, '2020-05-31 22:00:00'),
(1, 1, 3.8, '2020-08-31 22:00:00'),
(1, 2, 3.1, '2019-12-31 23:00:00'),
(1, 2, 3.3, '2020-02-29 23:00:00'),
(1, 2, 3.3, '2020-05-31 22:00:00'),
(1, 2, 3.4, '2020-08-31 22:00:00'),
(1, 3, 2.2, '2019-12-31 23:00:00'),
(1, 3, 2.3, '2020-02-29 23:00:00'),
(1, 3, 2.5, '2020-05-31 22:00:00'),
(1, 3, 2.6, '2020-08-31 22:00:00'),
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
(31, 3, 2.3, '2022-04-26 01:26:13');

-- --------------------------------------------------------

--
-- Table structure for table `dimempleado_actual`
--

CREATE TABLE `dimempleado_actual` (
  `idEmpleado` int(11) NOT NULL,
  `idDimension` int(11) NOT NULL,
  `nivelE` float DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dimempleado_actual`
--

INSERT INTO `dimempleado_actual` (`idEmpleado`, `idDimension`, `nivelE`, `fecha`) VALUES
(1, 1, 3.8, '2020-08-31 22:00:00'),
(1, 2, 3.4, '2020-08-31 22:00:00'),
(1, 3, 2.6, '2020-08-31 22:00:00'),
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
(31, 3, 2.3, '2022-04-26 01:26:13');

-- --------------------------------------------------------

--
-- Table structure for table `dimension`
--

CREATE TABLE `dimension` (
  `idDimension` int(11) NOT NULL,
  `nombre` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dimension`
--

INSERT INTO `dimension` (`idDimension`, `nombre`) VALUES
(1, 'Craft'),
(2, 'People & Mindsets'),
(3, 'Commercial & customer');

-- --------------------------------------------------------

--
-- Table structure for table `empleado`
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
-- Dumping data for table `empleado`
--

INSERT INTO `empleado` (`idEmpleado`, `nombre`, `apellidoP`, `apellidoM`, `correo`, `contrasena`, `idEquipo`, `fotoPerfil`, `activo`) VALUES
(1, 'Bernardo', 'Laing', '', 'bernardoLaing@gmail.com', '$2a$12$r60qZNiwmbHglnSg.ywgO.H7YxYxAqBsHBWrtRdZlppHhp9wIZhg.', 1, '1650985519882-gatorpueba.jpg', 1),
(2, 'Nicolás', 'Rodriguez', NULL, 'nicolasRdz@gmail.com', '$2a$12$jwItQLDnzyQBeM2pFVo01O.EARGJwxdI3gMoCgwX2eoIP6bwFt./y', 2, 'iconperfil.png', 1),
(3, 'Gabriel', 'Huitrón', NULL, 'gabrielHuitron@gmail.com', '$2a$12$daoeu2mHhK66vYNQaKsdqOsCOLnk7BmVhGBzUzUsn6a1meSv7iA4.', 3, 'iconperfil.png', 1),
(4, 'Alma', 'Patiño', NULL, 'almaPatino@gmail.com', NULL, 4, 'iconperfil.png', 1),
(5, 'Oriana', 'Gaterol', NULL, 'orianaGaterol@gmail.com', NULL, 5, 'iconperfil.png', 1),
(6, 'Felipe', 'Ossandon', NULL, 'felipeOssadon@gmail.com', NULL, 6, 'iconperfil.png', 1),
(7, 'Carlos', 'Rios', NULL, 'carlosRios@gmail.com', NULL, 7, 'iconperfil.png', 1),
(8, 'Diego', 'Avendaño', NULL, 'diegoAvedaño@gmail.com', NULL, 3, 'iconperfil.png', 1),
(9, 'Valter', 'Nuñez', NULL, 'valterNuñez@gmail.com', NULL, 1, 'iconperfil.png', 1),
(10, 'Pedro', 'Rodríguez', NULL, 'pedroRdz@gmail.com', NULL, 1, 'iconperfil.png', 1),
(11, 'Natalia', 'Rodriguez', NULL, 'nataliaRdz@gmail.com', NULL, 1, 'iconperfil.png', 1),
(12, 'Edgar', 'Santana', NULL, 'edgarSantana@gmail.com', NULL, 6, 'iconperfil.png', 1),
(13, 'Cristhian', 'Abarca', NULL, 'cristhianAbarca@gmail.com', NULL, 7, 'iconperfil.png', 1),
(14, 'Dalton', 'Nuñez', NULL, 'daltonNuñez@gmail.com', NULL, 7, 'iconperfil.png', 1),
(15, 'Kevin', 'Rojas', NULL, 'kevinRojas@gmail.com', NULL, 6, 'iconperfil.png', 1),
(16, 'Iván', 'Celis', NULL, 'ivanCelis@gmail.com', NULL, 7, 'iconperfil.png', 1),
(17, 'Julio', 'De Alba', NULL, 'julioDeAlba@gmail.com', NULL, 2, 'iconperfil.png', 1),
(18, 'Aldo', 'Rivera', NULL, 'aldoRivera@gmail.com', NULL, 3, 'iconperfil.png', 1),
(19, 'Erick', 'Samaniego', NULL, 'erickSamaniego@gmail.com', NULL, 2, 'iconperfil.png', 1),
(20, 'Matías', 'Becerra', NULL, 'matiasBecerra@gmail.com', NULL, 6, 'iconperfil.png', 1),
(21, 'Abraham', 'Febres', NULL, 'abrahamFebres@gmail.com', NULL, 6, 'iconperfil.png', 0),
(23, 'Karen', 'López', NULL, 'anakaren@example.com', NULL, 5, 'iconperfil.png', 0),
(24, 'Enrique', 'Vela', 'Vista', 'enriqueVela@gmail.com', '$2a$12$v5PnrJw4RAkRZXp0vNTQfuN', 2, '1650413560784-enrique.jpg', 1),
(25, 'Greta', 'Alivi', 'Torres', 'gretaAlivi@gmail.com', '$2a$12$sK9YcWXXIQ.PBXOKBjDp/.X', 7, '1650415270352-greta.jpg', 1),
(26, 'Jordana', 'Betancourt', 'Menchaca', 'jordanabm2@gmail.com', '$2a$12$faOA0RgSlFaIQ2L6o2w/WuT', 6, '1650560289697-jordywhats.jpg', 1),
(27, 'Ariana', 'Grande', 'Butera', 'arianaGrande@example.com', '$2a$12$yVPz7IWFNriaPSY2ZvrhouN', 4, '1650560422655-icon.png', 1),
(28, 'Bernardo', 'Quintana', 'Flores', 'bernardoQuintana@gmail.com', '$2a$12$jjotF5eRDDfy8V980VwsteX', 6, '1650560554043-icon.png', 1),
(29, 'Jordana', 'Gómez', 'Betancourt', 'hola@example.com', '$2a$12$h89ovwVG3It90NNbhtiyLOGfL7k.zTMkQN8B1puarmWxNqBHGCbGC', 4, 'iconperfil.png', 1),
(30, 'Paulina', 'del Campo', 'Cardona', 'PauDelCampo@example.com', '$2a$12$vTfKHnlvvgK2fYr3xptVQuV901Y0iR7xBir/KHi0qtE6PjVJ4t48O', 3, '1650935782841-pau.jpg', 1),
(31, 'Federico', 'Lisboa', '', 'federicoLisboa@example.com', '$2a$12$SNVFJFS0fs.0uKcq11Q/t.AYz99Km89EwtdRtsvdjbuENdRGT0GEW', 7, 'iconperfil.png', 1);

-- --------------------------------------------------------

--
-- Table structure for table `equipo`
--

CREATE TABLE `equipo` (
  `idEquipo` int(11) NOT NULL,
  `nombre` varchar(30) DEFAULT NULL,
  `descripcion` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `equipo`
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
-- Table structure for table `periodo`
--

CREATE TABLE `periodo` (
  `idPeriodo` int(11) NOT NULL,
  `NombrePeriodo` varchar(200) DEFAULT NULL,
  `fecha_inicial` date DEFAULT NULL,
  `fecha_final` date DEFAULT NULL,
  `anio` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `periodo`
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
(91, 'Abril-Julio', '2022-04-14', '2022-07-02', 2022);

-- --------------------------------------------------------

--
-- Table structure for table `pregunta`
--

CREATE TABLE `pregunta` (
  `idPregunta` int(11) NOT NULL,
  `idTipo` int(11) NOT NULL,
  `pregunta` varchar(400) DEFAULT NULL,
  `nivelP` int(11) DEFAULT NULL,
  `idDimension` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pregunta`
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
(22, 1, '¿Demuestra disposición para continuar aprendiendo nuevos lenguajes de programación?', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `preguntacuestionario`
--

CREATE TABLE `preguntacuestionario` (
  `idCuestionario` int(11) NOT NULL,
  `idPregunta` int(11) NOT NULL,
  `fechaInclusion` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `preguntacuestionario`
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
(16, 21, '2022-04-19');

-- --------------------------------------------------------

--
-- Table structure for table `privilegio`
--

CREATE TABLE `privilegio` (
  `idPrivilegio` int(11) NOT NULL,
  `accion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `privilegio`
--

INSERT INTO `privilegio` (`idPrivilegio`, `accion`) VALUES
(1, 'Ver mentorados'),
(2, 'Agregar empleado'),
(3, 'Formatos de evaluación');

-- --------------------------------------------------------

--
-- Table structure for table `respondesolicita`
--

CREATE TABLE `respondesolicita` (
  `idEvaluado` int(11) NOT NULL,
  `idEvaluador` int(11) NOT NULL,
  `idPregunta` int(11) NOT NULL,
  `idPeriodo` int(11) NOT NULL,
  `respuesta` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `respondesolicita`
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
(1, 2, 17, 91, '3');

-- --------------------------------------------------------

--
-- Table structure for table `retroalimentacion`
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
-- Dumping data for table `retroalimentacion`
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
(2, 18, 16, 7, 14, 91, NULL, '2022-04-23 16:55:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rol`
--

CREATE TABLE `rol` (
  `idRol` int(11) NOT NULL,
  `nombre` varchar(30) DEFAULT NULL,
  `descripcion` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rol`
--

INSERT INTO `rol` (`idRol`, `nombre`, `descripcion`) VALUES
(1, 'CL', 'Chapter Leader'),
(2, 'CLA', 'Chapter Leader Assistant'),
(3, 'CM', 'Chapter Member');

-- --------------------------------------------------------

--
-- Table structure for table `rolempleado`
--

CREATE TABLE `rolempleado` (
  `idEmpleado` int(11) NOT NULL,
  `idRol` int(11) NOT NULL,
  `fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rolempleado`
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
(31, 3, '2022-04-26');

-- --------------------------------------------------------

--
-- Table structure for table `rolprivilegio`
--

CREATE TABLE `rolprivilegio` (
  `idRol` int(11) NOT NULL,
  `idPrivilegio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rolprivilegio`
--

INSERT INTO `rolprivilegio` (`idRol`, `idPrivilegio`) VALUES
(1, 2),
(1, 1),
(2, 1),
(1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `tipopregunta`
--

CREATE TABLE `tipopregunta` (
  `idTipo` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tipopregunta`
--

INSERT INTO `tipopregunta` (`idTipo`, `descripcion`) VALUES
(1, 'numérica'),
(2, 'texto');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `asignacionempleado`
--
ALTER TABLE `asignacionempleado`
  ADD PRIMARY KEY (`idMentor`,`idMentorado`),
  ADD KEY `idMentorado` (`idMentorado`);

--
-- Indexes for table `cuestionario`
--
ALTER TABLE `cuestionario`
  ADD PRIMARY KEY (`idCuestionario`);

--
-- Indexes for table `dimempleado`
--
ALTER TABLE `dimempleado`
  ADD PRIMARY KEY (`idEmpleado`,`idDimension`,`fecha`) USING BTREE,
  ADD KEY `idEmpleado` (`idEmpleado`),
  ADD KEY `idDimension` (`idDimension`);

--
-- Indexes for table `dimempleado_actual`
--
ALTER TABLE `dimempleado_actual`
  ADD PRIMARY KEY (`idEmpleado`,`idDimension`,`fecha`) USING BTREE,
  ADD KEY `idEmpleado` (`idEmpleado`),
  ADD KEY `idDimension` (`idDimension`);

--
-- Indexes for table `dimension`
--
ALTER TABLE `dimension`
  ADD PRIMARY KEY (`idDimension`);

--
-- Indexes for table `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`idEmpleado`),
  ADD KEY `idEquipo` (`idEquipo`);

--
-- Indexes for table `equipo`
--
ALTER TABLE `equipo`
  ADD PRIMARY KEY (`idEquipo`);

--
-- Indexes for table `periodo`
--
ALTER TABLE `periodo`
  ADD PRIMARY KEY (`idPeriodo`);

--
-- Indexes for table `pregunta`
--
ALTER TABLE `pregunta`
  ADD PRIMARY KEY (`idPregunta`),
  ADD KEY `idDimension` (`idDimension`),
  ADD KEY `idTipo` (`idTipo`);

--
-- Indexes for table `preguntacuestionario`
--
ALTER TABLE `preguntacuestionario`
  ADD KEY `idCuestionario` (`idCuestionario`),
  ADD KEY `idPregunta` (`idPregunta`);

--
-- Indexes for table `privilegio`
--
ALTER TABLE `privilegio`
  ADD PRIMARY KEY (`idPrivilegio`);

--
-- Indexes for table `respondesolicita`
--
ALTER TABLE `respondesolicita`
  ADD KEY `idEvaluado` (`idEvaluado`),
  ADD KEY `idEvaluador` (`idEvaluador`),
  ADD KEY `idPregunta` (`idPregunta`),
  ADD KEY `idPeriodo` (`idPeriodo`);

--
-- Indexes for table `retroalimentacion`
--
ALTER TABLE `retroalimentacion`
  ADD KEY `idEvaluado` (`idEvaluado`),
  ADD KEY `idEvaluador` (`idEvaluador`),
  ADD KEY `idCuestionarioCraft` (`idCuestionarioCraft`),
  ADD KEY `idCuestionarioPeople` (`idCuestionarioPeople`),
  ADD KEY `idCuestionarioBusiness` (`idCuestionarioBusiness`),
  ADD KEY `idPeriodo` (`idPeriodo`);

--
-- Indexes for table `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`idRol`);

--
-- Indexes for table `rolempleado`
--
ALTER TABLE `rolempleado`
  ADD KEY `idEmpleado` (`idEmpleado`),
  ADD KEY `idRol` (`idRol`);

--
-- Indexes for table `rolprivilegio`
--
ALTER TABLE `rolprivilegio`
  ADD KEY `idRol` (`idRol`),
  ADD KEY `idPrivilegio` (`idPrivilegio`);

--
-- Indexes for table `tipopregunta`
--
ALTER TABLE `tipopregunta`
  ADD PRIMARY KEY (`idTipo`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cuestionario`
--
ALTER TABLE `cuestionario`
  MODIFY `idCuestionario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `dimension`
--
ALTER TABLE `dimension`
  MODIFY `idDimension` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `empleado`
--
ALTER TABLE `empleado`
  MODIFY `idEmpleado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `equipo`
--
ALTER TABLE `equipo`
  MODIFY `idEquipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `periodo`
--
ALTER TABLE `periodo`
  MODIFY `idPeriodo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `pregunta`
--
ALTER TABLE `pregunta`
  MODIFY `idPregunta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `privilegio`
--
ALTER TABLE `privilegio`
  MODIFY `idPrivilegio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rol`
--
ALTER TABLE `rol`
  MODIFY `idRol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tipopregunta`
--
ALTER TABLE `tipopregunta`
  MODIFY `idTipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `asignacionempleado`
--
ALTER TABLE `asignacionempleado`
  ADD CONSTRAINT `asignacionempleado_ibfk_1` FOREIGN KEY (`idMentor`) REFERENCES `empleado` (`idEmpleado`),
  ADD CONSTRAINT `asignacionempleado_ibfk_2` FOREIGN KEY (`idMentorado`) REFERENCES `empleado` (`idEmpleado`);

--
-- Constraints for table `dimempleado`
--
ALTER TABLE `dimempleado`
  ADD CONSTRAINT `dimempleado_ibfk_1` FOREIGN KEY (`idEmpleado`) REFERENCES `empleado` (`idEmpleado`),
  ADD CONSTRAINT `dimempleado_ibfk_2` FOREIGN KEY (`idDimension`) REFERENCES `dimension` (`idDimension`);

--
-- Constraints for table `dimempleado_actual`
--
ALTER TABLE `dimempleado_actual`
  ADD CONSTRAINT `dimempleado_actual_ibfk_1` FOREIGN KEY (`idDimension`) REFERENCES `dimension` (`idDimension`),
  ADD CONSTRAINT `dimempleado_actual_ibfk_2` FOREIGN KEY (`idEmpleado`) REFERENCES `empleado` (`idEmpleado`);

--
-- Constraints for table `empleado`
--
ALTER TABLE `empleado`
  ADD CONSTRAINT `empleado_ibfk_1` FOREIGN KEY (`idEquipo`) REFERENCES `equipo` (`idEquipo`);

--
-- Constraints for table `pregunta`
--
ALTER TABLE `pregunta`
  ADD CONSTRAINT `pregunta_ibfk_1` FOREIGN KEY (`idDimension`) REFERENCES `dimension` (`idDimension`),
  ADD CONSTRAINT `pregunta_ibfk_2` FOREIGN KEY (`idTipo`) REFERENCES `tipopregunta` (`idTipo`);

--
-- Constraints for table `preguntacuestionario`
--
ALTER TABLE `preguntacuestionario`
  ADD CONSTRAINT `preguntacuestionario_ibfk_1` FOREIGN KEY (`idCuestionario`) REFERENCES `cuestionario` (`idCuestionario`),
  ADD CONSTRAINT `preguntacuestionario_ibfk_2` FOREIGN KEY (`idPregunta`) REFERENCES `pregunta` (`idPregunta`);

--
-- Constraints for table `respondesolicita`
--
ALTER TABLE `respondesolicita`
  ADD CONSTRAINT `respondesolicita_ibfk_1` FOREIGN KEY (`idEvaluador`) REFERENCES `empleado` (`idEmpleado`),
  ADD CONSTRAINT `respondesolicita_ibfk_2` FOREIGN KEY (`idEvaluado`) REFERENCES `empleado` (`idEmpleado`);

--
-- Constraints for table `retroalimentacion`
--
ALTER TABLE `retroalimentacion`
  ADD CONSTRAINT `retroalimentacion_ibfk_1` FOREIGN KEY (`idEvaluado`) REFERENCES `empleado` (`idEmpleado`),
  ADD CONSTRAINT `retroalimentacion_ibfk_2` FOREIGN KEY (`idEvaluador`) REFERENCES `empleado` (`idEmpleado`),
  ADD CONSTRAINT `retroalimentacion_ibfk_3` FOREIGN KEY (`idCuestionarioCraft`) REFERENCES `cuestionario` (`idCuestionario`),
  ADD CONSTRAINT `retroalimentacion_ibfk_4` FOREIGN KEY (`idCuestionarioPeople`) REFERENCES `cuestionario` (`idCuestionario`),
  ADD CONSTRAINT `retroalimentacion_ibfk_5` FOREIGN KEY (`idCuestionarioBusiness`) REFERENCES `cuestionario` (`idCuestionario`),
  ADD CONSTRAINT `retroalimentacion_ibfk_6` FOREIGN KEY (`idPeriodo`) REFERENCES `periodo` (`idPeriodo`);

--
-- Constraints for table `rolempleado`
--
ALTER TABLE `rolempleado`
  ADD CONSTRAINT `rolempleado_ibfk_1` FOREIGN KEY (`idEmpleado`) REFERENCES `empleado` (`idEmpleado`),
  ADD CONSTRAINT `rolempleado_ibfk_2` FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`);

--
-- Constraints for table `rolprivilegio`
--
ALTER TABLE `rolprivilegio`
  ADD CONSTRAINT `rolprivilegio_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `rol` (`idRol`),
  ADD CONSTRAINT `rolprivilegio_ibfk_2` FOREIGN KEY (`idPrivilegio`) REFERENCES `privilegio` (`idPrivilegio`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
