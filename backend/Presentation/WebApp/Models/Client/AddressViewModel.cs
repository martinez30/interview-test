using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using WebApp.Services.DTOs;

namespace WebApp.Models.Client
{
    public class AddressViewModel
    {
        [DisplayName("CEP")]
        [Required(ErrorMessage = "Campo obrigatório")]
        public string PostalCode { get; set; }
        [DisplayName("Logradouro")]
        [Required(ErrorMessage = "Campo obrigatório")]
        public string AddressLine { get; set; }
        [DisplayName("Número")]
        [Required(ErrorMessage = "Campo obrigatório")]
        public string Number { get; set; }
        [DisplayName("Complemento")]
        public string Complement { get; set; }
        [DisplayName("Bairro")]
        [Required(ErrorMessage = "Campo obrigatório")]
        public string Neighborhood { get; set; }
        [DisplayName("Cidade")]
        [Required(ErrorMessage = "Campo obrigatório")]
        public string City { get; set; }
        [DisplayName("Estado")]
        [Required(ErrorMessage = "Campo obrigatório")]
        public string State { get; set; }

        public AddressViewModel()
        {

        }

        public AddressViewModel(AddressDTO dto)
        {
            PostalCode = dto.PostalCode;
            AddressLine = dto.AddressLine;
            Number = dto.Number;
            Complement = dto.Complement;
            Neighborhood = dto.Neighborhood;
            City = dto.City;
            State = dto.State;
        }

        public AddressDTO ToDTO()
        {
            return new AddressDTO
            {
                PostalCode = PostalCode,
                AddressLine = AddressLine,
                Number = Number,
                Complement = Complement,
                Neighborhood = Neighborhood,
                City = City,
                State = State
            };
        }
    }
}
