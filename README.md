UPDATE game_bazar
SET bazar_category = 'normal'
WHERE bazar_category IS NULL OR bazar_category = '';


UPDATE game_bazar
SET bazar_category = 'normal'
WHERE bazar_category IS NULL OR bazar_category = '';



CREATE TABLE IF NOT EXISTS lucky_number_request (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mobile_number VARCHAR(10) NOT NULL,
  lucky_digit TINYINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

