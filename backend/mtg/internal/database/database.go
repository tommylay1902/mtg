package database

import (
	"fmt"
	"log"
	"mtg/internal/models/entity"

	"os"

	_ "github.com/joho/godotenv/autoload"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	database = os.Getenv("DB_DATABASE")
	password = os.Getenv("DB_PASSWORD")
	username = os.Getenv("DB_USERNAME")
	port     = os.Getenv("DB_PORT")
	host     = os.Getenv("DB_HOST")
)

func New() *gorm.DB {
	connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", username, password, host, port, database)

	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{})

	if err != nil {
		log.Panic("error connecting to db", err)
	}

	db.AutoMigrate(&entity.HealthCareFacility{})
	db.AutoMigrate(&entity.Location{})
	db.AutoMigrate(&entity.MedicationType{})
	db.AutoMigrate(&entity.Doctor{})
	db.AutoMigrate(&entity.Prescription{})
	db.AutoMigrate(&entity.PrescriptionHistory{})
	return db
}
