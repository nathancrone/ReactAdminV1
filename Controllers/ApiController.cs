using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace ReactAdminV1.Controllers
{
    public class ApiController : ControllerBase
    {
        private IEnumerable<object> _authors = new[] { new {
            Id = 0,
            FirstName = "",
            LastName = ""
        }};

        [HttpGet]
        public ActionResult<IEnumerable<object>> GetAllAuthors()
        {
            return _authors.ToList();
        }

        [HttpGet]
        public ActionResult<IEnumerable<object>> GetAuthorById(int Id)
        {

            return _authors.ToList();
        }
    }
}
