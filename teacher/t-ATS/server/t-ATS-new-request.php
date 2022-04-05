<!DOCTYPE html>
<html>
<?php
		$data_directory = "../../database/";

		function loginTeacher($teacher_id) {
			global $data_directory;

			$teacher_hash = hash('md5', "Technoboard".$teacher_id."194021119402241940261");
			$teacher_directory_name = "t-".$teacher_hash;

			$path = $data_directory.$teacher_directory_name;
			if(!file_exists($path)) {
				mkdir($path);
			}
			
			return $teacher_directory_name."/";
		}

		function loginClass($teacher_key, $class_id, $session_id, $request_id) {
			global $data_directory;

			//$class_hash = hash('md5', "Technoboard".$teacher_key.$class_id."194021119402241940261");
			$class_hash = $class_id;

			$class_directory_name = "c-".$class_hash;

			$path = $data_directory.$teacher_key.$class_directory_name;
			if(!file_exists($path)) {
				mkdir($path);
			}
			
			return $teacher_key.$class_directory_name."/";
		}

		function createPortal($class_key, $session_id, $request_id, $status) {
			global $data_directory;

			$path = $data_directory.$class_key."portal.json";
			
			$portal = array(
				'sessionID' => strval($session_id),
				'requestID' => strval($request_id),
				'publish' => ($status ? 'true' : 'false')
			);

			$fp = fopen($path, 'w');
			fwrite($fp, json_encode($portal));
			fclose($fp);
		}

		function loginSession($class_key, $session_id) {
			global $data_directory;

			//$session_hash = hash('md5', "Technoboard".$class_key.$session_id."194021119402241940261");
			$session_hash = $session_id;

			$session_directory_name = "s-".$session_hash;
			
			$path = $data_directory.$class_key.$session_directory_name;
			if(!file_exists($path)) {
				mkdir($path);
			}

			return $class_key.$session_directory_name."/";
		}

		function createRequest($session_key, $request_id) {
			global $data_directory;

			$request_file_name = "r-".$request_id.".json";

			$path = $data_directory.$session_key.$request_file_name;
			$fp = fopen($path, 'w');
			fwrite($fp, "[]");
			fclose($fp);
		}

		if( !empty($_GET['id']) and !empty($_GET['c']) and !empty($_GET['s']) ) {
            $teacher_id = $_GET['id'];
			$class_id = $_GET['c'];
			$session_id = $_GET['s'];
			$request_id = (int)(time());
			
			$class = loginClass(
				loginTeacher($teacher_id),
				$class_id,
				$session_id,
				$request_id
			);
			$session = loginSession($class, $session_id);

			createRequest($session, $request_id);

			createPortal($class, $session_id, $request_id, True);
			usleep(5000000);
			createPortal($class, $session_id, $request_id, False);
		}
?>
</html>