package main

import (
	"database/sql"
	"errors"
	"flag"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

var (
	mysqlDatabaseURL string
	expectedVersion  uint = 2
)

func init() {
	flag.StringVar(&mysqlDatabaseURL, "mysql-database-url", "", "MySQL Database URL for connections")
}

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	flag.Parse()

	db, err := sql.Open("mysql", mysqlDatabaseURL)
	if err != nil {
		return err
	}
	defer db.Close()

	driver, err := mysql.WithInstance(db, &mysql.Config{})
	if err != nil {
		return err
	}

	m, err := migrate.NewWithDatabaseInstance("file://migrations", "mysql", driver)
	if err != nil {
		return err
	}

	currentVersion, _, err := m.Version()
	if err != nil {
		if !errors.Is(err, migrate.ErrNilVersion) {
			return fmt.Errorf("getting current migrations version: %w", err)
		}

		if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
			return fmt.Errorf("running migrations: %w", err)
		}
	}

	if currentVersion < expectedVersion {
		if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
			return fmt.Errorf("running migrations: %w", err)
		}
	}

	return nil
}
