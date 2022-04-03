<!DOCTYPE html>
<html>
<?php
		$data_directory = "./database/";

		function loginTeacher($teacher_id) {
			global $data_directory;

			$teacher_hash = hash('md5', "Technoboard".$teacher_id."194021119402241940261");
			$teacher_directory_name = "t".$teacher_hash;

			$path = $data_directory.$teacher_directory_name;
			if(!file_exists($path)) {
				mkdir($path);
			}
			
			return $teacher_directory_name."/";
		}

		function loginClass($teacher_key, $class_id) {
			global $data_directory;

			$class_hash = hash('md5', "Technoboard".$teacher_key.$class_id."194021119402241940261");
			$class_directory_name = "c".$class_hash;

			$path = $data_directory.$teacher_key.$class_directory_name;
			if(!file_exists($path)) {
				mkdir($path);
			}
			
			return $teacher_key.$class_directory_name."/";
		}

		function loginSession($class_key, $session_id) {
			global $data_directory;

			$session_hash = hash('md5', "Technoboard".$class_key.$session_id."194021119402241940261");
			$session_directory_name = "s".$session_hash;
			
			$path = $data_directory.$class_key.$session_directory_name;
			if(!file_exists($path)) {
				mkdir($path);
			}

			return $class_key.$session_directory_name."/";
		}

		function createRequest($session_key, $request_id) {
			global $data_directory;

			$request_file_name = "r".$request_id."json";

			$path = $data_directory.$session_key.$request_file_name;
			$fp = fopen($path, 'w');
			fwrite($fp, "[]");
			fclose($fp);
		}

        function updateSession($session_key) {

			$meta_path = $session_key."meta.json";

            //$session_hash = hash('md5', $session_id."Technoboard194021119402241940261");
			$existing_meta = file_get_contents($meta_file_name);
            $meta = array('SessionID' => strval($session_hash), 'DateTime' => strval((int)(time())));

			$updated_meta = $existing_meta;
			$updated_array[$id] = Array (
				"ID" => strval($id + 1),
				"RegNo" => strval($reg_no)
			);

            #Implement Calendar here
			$fp = fopen($meta_file_name, 'w');
			fwrite($fp, json_encode($meta));
			fclose($fp);

            return $session_hash;
        }

		if( !empty($_GET['id']) and !empty($_GET['c']) and !empty($_GET['s']) ) {
            $teacher_id = $_GET['id'];
			$class_id = $_GET['c'];
			$session_id = $_GET['s'];
			
			/*$teacher_key = loginTeacher($teacher_id);
			$class_key = loginClass($teacher_key, $class_id);
			$session_key = loginSession($class_key, $session_id);*/
			
			session = loginSession(
						loginClass(
							loginTeacher($teacher_id),
							$class_id
						),
						$session_id
					);
			createRequest(session, (int)(time()));

            //$session_hash = updateMeta($session_id, $teacher_id);
			//newSession($session_hash);
		}
?>
</html>