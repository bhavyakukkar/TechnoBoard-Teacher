<?php
		header('Access-Control-Allow-Origin: *');
		
		$data_directory = "../../database/";
		
		function loginTeacher($teacher_id) {
			$teacher_hash = hash('md5', "Technoboard".$teacher_id."194021119402241940261");
			$teacher_directory_name = "t-".$teacher_hash;

			return $teacher_directory_name."/";
		}

		function loginClass($teacher_key, $class_id) {
			$class_directory_name = "c-".$class_id;

			return $teacher_key.$class_directory_name."/";
		}

		function findPortal($class_key) {
			global $data_directory;

			$portal_path = $data_directory.$class_key."portal.json";
			$portal_json = file_get_contents($portal_path);
			$portal = json_decode($portal_json, true);

			return $portal;
		}

		function loginSession($class_key, $portal) {
			$session_id = $portal['sessionID'];
			$session_directory_name = "s-".$session_id;

			return $class_key.$session_directory_name."/";
		}

		function loginRequest($session_key, $portal) {
			$request_id = $portal['requestID'];
			$request_file_name = "r-".$request_id.".json";
			
			return $session_key.$request_file_name;
		}

        function retrieveRequest($request_key) {
            global $data_directory;

			$path = $data_directory.$request_key;
			$existing_json = file_get_contents($path);
			$existing_array = json_decode($existing_json, true);

			$existing_length = count($existing_array);

            print '<table id="result"><tr>';
			for($i = 0; $i < $existing_length; $i++) {
				print '<td>';
				print $existing_array[$i]["StudentID"];
				print '</td>';
			}
            print '</tr></table>';
        }

		if(!empty($_GET['t']) and !empty($_GET['c'])) {
			$teacher_id = $_GET['t'];
			$class_id = $_GET['c'];
			
			$class = loginClass(
				loginTeacher($teacher_id),
				$class_id
			);

			$portal = findPortal($class);

			$request = loginRequest(
				loginSession(
					$class,
					$portal
				),
				$portal
			);
			retrieveRequest($request);
		}
?>
</body>
</html>